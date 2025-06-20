package paypalscraper

import (
	"bytes"
	"fmt"
	"mylife-money/pkg/services/bots/common"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html"
)

type transactionItem struct {
	Name  string
	Value []string
}

type item struct {
	Description string
	UnitPrice   amount
	Quantity    int
	Amount      amount
}

type summaryItem struct {
	Name   string
	Amount amount
}

type amount struct {
	Value    float64
	Currency string
}

func (a *amount) String() string {
	return fmt.Sprintf("%.2f %s", a.Value, a.Currency)
}

type receipt struct {
	Id          string
	Date        time.Time
	Amount      float64 // EUR
	MailSubject string
	Url         string
	Transaction []transactionItem
	Items       []item
	Totals      []summaryItem
	// Sources     []summaryItem
}

func (b *bot) fetchReceipts() ([]*receipt, error) {

	fetcher, err := common.NewMailFetcher(b.ctx, b.logger, b.mailFetcherConfig, b.config.Mailbox)
	if err != nil {
		return nil, err
	}

	msgs, err := fetcher.FetchMails(b.config.From, b.config.Subject, b.config.SinceDays)
	if err != nil {
		return nil, err
	}

	receipts := make([]*receipt, 0, len(msgs))

	for _, msg := range msgs {
		receipt, err := b.readReceipt(msg)
		if err != nil {
			b.logger.Errorf("failed to read receipt from message %s: %s", msg, err)
			continue
		}

		receipts = append(receipts, receipt)
	}

	return receipts, nil
}

func (b *bot) readReceipt(msg *common.MailMessage) (*receipt, error) {
	part := msg.FindPartByType("text/html")
	if part == nil {
		return nil, fmt.Errorf("no HTML part found in message %d", msg.UID())
	}

	htmlContent, err := part.Download()
	if err != nil {
		return nil, fmt.Errorf("failed to download HTML part for message %d: %s", msg.UID(), err)
	}

	receipt := &receipt{}
	receipt.Date = msg.Date()
	receipt.MailSubject = msg.Subject()

	if err := b.processHtmlMessage(receipt, htmlContent); err != nil {
		return nil, fmt.Errorf("failed to process HTML message content for message %d: %s", msg.UID(), err)
	}

	// Find total in EUR
	var totalItem *summaryItem
	for _, total := range receipt.Totals {
		if total.Name == "Total" {
			totalItem = &total
			break
		}
	}

	if totalItem == nil {
		return nil, fmt.Errorf("no total found in receipt totals")
	}

	// Check if total amount is in EUR
	if !strings.Contains(totalItem.Amount.Currency, "EUR") && !strings.Contains(totalItem.Amount.Currency, "€") {
		return nil, fmt.Errorf("total amount is not in EUR: '%s'", totalItem.Amount.Currency)
	}

	receipt.Amount = totalItem.Amount.Value

	return receipt, nil
}

func (b *bot) processHtmlMessage(receipt *receipt, htmlContent []byte) error {

	// Fetch imageUrl/productUrl from HTML content
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(htmlContent))
	if err != nil {
		return fmt.Errorf("failed to parse HTML content: %w", err)
	}

	url, found := doc.Find("a:contains(\"Afficher l'état du paiement\")").First().Attr("href")
	if !found {
		return fmt.Errorf("failed to find receipt url")
	}

	// Pick only before ?
	receipt.Url = strings.Split(url, "?")[0]

	// first cartDetails table is transaction info
	// if any, cartDetails table here is items info
	// last is total info

	nodes := doc.Find("table[id='cartDetails']").Nodes

	var transNode, detailNode, totalNode *html.Node

	switch len(nodes) {
	case 2:
		transNode = nodes[0]
		totalNode = nodes[1]

	case 3:
		transNode = nodes[0]
		detailNode = nodes[1]
		totalNode = nodes[2]

	default:
		return fmt.Errorf("expected 2 or 3 'cartDetails' tables, got %d", len(nodes))
	}

	receipt.Transaction, err = b.parseTransactionTable(transNode)
	if err != nil {
		return fmt.Errorf("failed to parse transaction Node: %w", err)
	}

	if detailNode != nil {
		receipt.Items, err = b.parseTableItemsTable(detailNode)
		if err != nil {
			return fmt.Errorf("failed to parse detail Node: %w", err)
		}
	}

	receipt.Totals, err = b.parseTableTotalsTable(totalNode)
	if err != nil {
		return fmt.Errorf("failed to parse total Node: %w", err)
	}

	return nil
}

func (b *bot) parseTransactionTable(table *html.Node) ([]transactionItem, error) {
	// Get direct tbody > tr > td nodes
	cells, err := b.listTableCells(table)
	if err != nil {
		return nil, fmt.Errorf("failed to list table cells: %w", err)
	}

	items := make([]transactionItem, 0)

	for _, cell := range cells {
		item, err := b.parseTransactionCell(cell)
		if err != nil {
			return nil, fmt.Errorf("failed to parse table cell: %w", err)
		}

		items = append(items, item)
	}

	return items, nil
}

func (b *bot) parseTransactionCell(node *html.Node) (transactionItem, error) {
	// one span for title and one for values
	nodes := b.childNodes(node)

	// remove br nodes
	nodes = slices.DeleteFunc(nodes, func(n *html.Node) bool {
		return n.Data == "br"
	})

	if len(nodes) != 2 {
		return transactionItem{}, fmt.Errorf("expected 2 nodes in item, got %d", len(nodes))
	}

	name, err := b.readName(nodes[0])
	if err != nil {
		return transactionItem{}, fmt.Errorf("failed to read name from node: %w", err)
	}

	// Value is always in a span, but the span can be in a table, p, another span, etc.
	// So we look for the node which is a span at the deepest level
	value, err := b.readText(nodes[1])
	if err != nil {
		return transactionItem{}, fmt.Errorf("failed to read text from node: %w", err)
	}

	item := transactionItem{
		Name:  name,
		Value: value,
	}

	return item, nil
}

func (b *bot) parseTableItemsTable(table *html.Node) ([]item, error) {
	rows, err := b.listTableRows(table)
	if err != nil {
		return nil, fmt.Errorf("failed to list table rows: %w", err)
	}

	items := make([]item, 0)

	for _, row := range rows {
		// expect rows with 2 cells: description+quantity and amount
		cells := b.childNodes(row)
		if len(cells) != 2 {
			return nil, fmt.Errorf("expected 2 cells in row, got %d", len(cells))
		}
		if cells[0].Data != "td" || cells[1].Data != "td" {
			return nil, fmt.Errorf("expected 'td' nodes in row, got %s and %s", cells[0].Data, cells[1].Data)
		}

		description, quantity, err := b.parseItemDescriptionAndQuantity(cells[0])
		if err != nil {
			return nil, fmt.Errorf("failed to parse item description and quantity: %w", err)
		}

		unitPrice, err := b.parseAmountCell(cells[1])
		if err != nil {
			return nil, fmt.Errorf("failed to parse amount cell: %w", err)
		}

		// Compute total amount
		amount := amount{
			Value:    unitPrice.Value * float64(quantity),
			Currency: unitPrice.Currency,
		}

		items = append(items, item{
			Description: description,
			UnitPrice:   unitPrice,
			Quantity:    quantity,
			Amount:      amount,
		})
	}

	return items, nil
}

func (b *bot) parseItemDescriptionAndQuantity(cell *html.Node) (string, int, error) {
	// one span for description and one for Qte
	nodes := b.childNodes(cell)

	// remove br nodes
	nodes = slices.DeleteFunc(nodes, func(n *html.Node) bool {
		return n.Data == "br"
	})

	if len(nodes) < 2 {
		// Note: there are empty spans at the end of the cell...
		return "", 0, fmt.Errorf("expected 2 nodes in item, got %d", len(nodes))
	}

	description, err := b.readName(nodes[0])
	if err != nil {
		return "", 0, fmt.Errorf("failed to read description from node: %w", err)
	}
	quantityText, err := b.readName(nodes[1])
	if err != nil {
		return "", 0, fmt.Errorf("failed to read quantity from node: %w", err)
	}

	parts := strings.SplitN(quantityText, ":", 2)
	if len(parts) != 2 {
		return "", 0, fmt.Errorf("expected quantity to have 2 parts (label and value), got %d", len(parts))
	}

	if strings.TrimSpace(parts[0]) != "Qté" {
		return "", 0, fmt.Errorf("expected quantity label to be 'Qté', got '%s'", strings.TrimSpace(parts[0]))
	}

	quantity, err := strconv.Atoi(strings.TrimSpace(parts[1]))
	if err != nil {
		return "", 0, fmt.Errorf("failed to parse quantity '%s': %w", quantityText, err)
	}

	return description, quantity, nil
}

func (b *bot) parseTableTotalsTable(table *html.Node) ([]summaryItem, error) {
	rows, err := b.listTableRows(table)
	if err != nil {
		return nil, fmt.Errorf("failed to list table rows: %w", err)
	}

	items := make([]summaryItem, 0)

	for _, row := range rows {
		// expect rows with 2 cells: name and amount
		cells := b.childNodes(row)
		if len(cells) != 2 {
			return nil, fmt.Errorf("expected 2 cells in row, got %d", len(cells))
		}
		if cells[0].Data != "td" || cells[1].Data != "td" {
			return nil, fmt.Errorf("expected 'td' nodes in row, got %s and %s", cells[0].Data, cells[1].Data)
		}

		name, err := b.readName(cells[0])
		if err != nil {
			return nil, fmt.Errorf("failed to read name from cell: %w", err)
		}

		amount, err := b.parseAmountCell(cells[1])
		if err != nil {
			return nil, fmt.Errorf("failed to parse amount cell: %w", err)
		}

		items = append(items, summaryItem{
			Name:   name,
			Amount: amount,
		})
	}

	return items, nil
}

func (b *bot) parseAmountCell(cell *html.Node) (amount, error) {
	strval, err := b.readName(cell)
	if err != nil {
		return amount{}, fmt.Errorf("failed to read name from cell: %w", err)
	}

	parts := strings.Fields(strval)
	if len(parts) < 2 {
		return amount{}, fmt.Errorf("expected amount to have 2 parts (value and currency), got %d: '%s'", len(parts), strval)
	}

	value, err := strconv.ParseFloat(strings.ReplaceAll(parts[0], ",", "."), 64)
	if err != nil {
		return amount{}, fmt.Errorf("failed to parse amount value '%s': %w", parts[0], err)
	}

	return amount{
		Value:    value,
		Currency: strings.Join(parts[1:], " "), // Join in case currency has multiple parts (e.g. "$ USD")
	}, nil
}

func (b *bot) listTableRows(table *html.Node) ([]*html.Node, error) {
	if table.Data != "table" {
		return nil, fmt.Errorf("expected 'table' node, got %s", table.Data)
	}

	rows := make([]*html.Node, 0)

	// Get direct tbody > tr nodes
	children := b.childNodes(table)
	if len(children) == 0 {
		return nil, fmt.Errorf("no child nodes found in table")
	}
	// We expect the first child to be a tbody
	tbody := children[0]
	if tbody.Data != "tbody" {
		return nil, fmt.Errorf("expected first child to be 'tbody', got %s", tbody.Data)
	}

	// Iterate over all tr nodes in tbody
	for _, trNode := range b.childNodes(tbody) {
		if trNode.Data != "tr" {
			return nil, fmt.Errorf("expected 'tr' node, got %s", trNode.Data)
		}

		rows = append(rows, trNode)
	}

	return rows, nil
}

func (b *bot) listTableCells(table *html.Node) ([]*html.Node, error) {
	rows, err := b.listTableRows(table)
	if err != nil {
		return nil, err
	}

	cells := make([]*html.Node, 0)

	for _, trNode := range rows {
		if trNode.Data != "tr" {
			return nil, fmt.Errorf("expected 'tr' node, got %s", trNode.Data)
		}

		// Iterate over all td nodes in tr
		for _, tdNode := range b.childNodes(trNode) {
			if tdNode.Data != "td" {
				return nil, fmt.Errorf("expected 'td' node, got %s", tdNode.Data)
			}

			cells = append(cells, tdNode)
		}
	}

	return cells, nil
}

func (b *bot) readName(node *html.Node) (string, error) {
	text, err := b.readText(node)
	if err != nil {
		return "", err
	}
	if len(text) != 1 {
		return "", fmt.Errorf("expected 1 text value in node, got %d", len(text))
	}
	return strings.TrimSpace(text[0]), nil
}

func (b *bot) readText(node *html.Node) ([]string, error) {
	// Value is always in a span, but the span can be in a table, p, another span, etc.
	// So we look for the node which is a span at the deepest level
	doc := goquery.NewDocumentFromNode(node)
	spans := make(map[*html.Node]int)
	b.collectSpans(node, spans, 0)

	max := 0

	for span, depth := range spans {
		if depth > max {
			max = depth
			node = span
		}
	}

	value, err := doc.FindNodes(node).Html()
	if err != nil {
		return nil, fmt.Errorf("failed to get HTML from node: %w", err)
	}

	values := strings.Split(value, "<br/>")

	for i, v := range values {
		values[i] = html.UnescapeString(v)
	}

	return values, nil
}

func (b *bot) collectSpans(node *html.Node, spans map[*html.Node]int, depth int) {
	if node.Type == html.ElementNode && node.Data == "span" {
		spans[node] = depth
	}

	for child := node.FirstChild; child != nil; child = child.NextSibling {
		b.collectSpans(child, spans, depth+1)
	}
}

func (b *bot) childNodes(node *html.Node) []*html.Node {
	nodes := make([]*html.Node, 0)

	if node.FirstChild == nil {
		return nodes
	}

	for child := node.FirstChild; child != nil; child = child.NextSibling {
		// remove non-element nodes (eg: line break between nodes in HTML)
		if child.Type == html.ElementNode {
			nodes = append(nodes, child)
		}
	}

	return nodes
}
