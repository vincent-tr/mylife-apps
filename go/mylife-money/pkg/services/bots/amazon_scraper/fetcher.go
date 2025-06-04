package amazonscraper

import (
	"bytes"
	"fmt"
	"mylife-money/pkg/services/bots/common"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html"
)

type order struct {
	Id     string
	Amount float64
	Date   time.Time
	Items  []orderItem
}

type orderItem struct {
	Name       string
	Quantity   int
	UnitPrice  float64
	ProductUrl string
	ImageUrl   string
}

func (b *bot) fetchOrders() ([]*order, error) {

	fetcher, err := common.NewMailFetcher(b.ctx, b.logger, b.mailFetcherConfig, b.config.Mailbox)
	if err != nil {
		return nil, err
	}

	msgs, err := fetcher.FetchMails(b.config.From, b.config.Subject, b.config.SinceDays)
	if err != nil {
		return nil, err
	}

	orders := make([]*order, 0, len(msgs))

	for _, msg := range msgs {
		part := msg.FindPartByType("text/html")
		if part == nil {
			return nil, fmt.Errorf("no HTML part found in message %d", msg.UID())
		}

		htmlContent, err := part.Download()
		if err != nil {
			return nil, fmt.Errorf("failed to download HTML part for message %d: %w", msg.UID(), err)
		}

		part = msg.FindPartByType("text/plain")
		if part == nil {
			return nil, fmt.Errorf("no text part found in message %d", msg.UID())
		}

		textContent, err := part.Download()
		if err != nil {
			return nil, fmt.Errorf("failed to download text part for message %d: %w", msg.UID(), err)
		}

		order := &order{}
		order.Date = msg.Date()

		if err := b.processTextMessage(order, textContent); err != nil {
			return nil, fmt.Errorf("failed to process text message content for message %d: %w", msg.UID(), err)
		}

		if err := b.processHtmlMessage(order, htmlContent); err != nil {
			return nil, fmt.Errorf("failed to process HTML message content for message %d: %w", msg.UID(), err)
		}

		orders = append(orders, order)
	}

	return orders, nil
}

func (b *bot) processTextMessage(order *order, textContent []byte) error {

	// Create blocks
	blocks := createBlocks(textContent)
	/*
		for i, block := range blocks {
			fmt.Printf("Block %d:\n", i+1)
			for _, line := range block {
				fmt.Printf("  %s\n", line)
			}
		}
	*/
	for _, block := range blocks {
		if block[0] == "N° de commande" {
			if len(block) != 2 {
				return fmt.Errorf("unexpected format for order ID block: %v", block)
			}

			order.Id = block[1]
		} else if block[0] == "Total" {
			if len(block) != 2 {
				return fmt.Errorf("unexpected format for total amount block: %v", block)
			}

			amount, err := parseAmount(block[1])
			if err != nil {
				return fmt.Errorf("failed to parse amount %q: %w", block[1], err)
			}
			order.Amount = amount
		} else if strings.HasPrefix(block[0], "* ") {
			// Example:
			// line 1: "* <nom produit>"
			// line 2: "Quantité: 1"
			// line 3: "32.99 EUR"
			if len(block) != 3 {
				return fmt.Errorf("unexpected format for order item block: %v", block)
			}

			name := strings.TrimPrefix(block[0], "* ")
			if !strings.HasPrefix(block[1], "Quantité: ") {
				return fmt.Errorf("unexpected format for quantity in block: %v", block)
			}
			quantityStr := strings.TrimPrefix(block[1], "Quantité: ")
			quantity, err := strconv.Atoi(quantityStr)
			if err != nil {
				return fmt.Errorf("failed to parse quantity %q: %w", quantityStr, err)
			}

			unitPrice, err := parseAmount(block[2])
			if err != nil {
				return fmt.Errorf("failed to parse amount %q: %w", block[2], err)
			}

			order.Items = append(order.Items, orderItem{
				Name:      name,
				Quantity:  quantity,
				UnitPrice: unitPrice,
				// productUrl and imageUrl will be filled later
			})
		}
	}

	return nil
}

func (b *bot) processHtmlMessage(order *order, htmlContent []byte) error {

	// Fetch imageUrl/productUrl from HTML content

	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(htmlContent))
	if err != nil {
		return fmt.Errorf("failed to parse HTML content: %w", err)
	}

	nodes := doc.Find("div[class='rootContent'] td[class='productImageTd'] > a").Nodes

	if len(nodes) != len(order.Items) {
		return fmt.Errorf("expected %d 'a' nodes, got %d", len(order.Items), len(nodes))
	}

	for i, aNode := range nodes {
		if aNode.Data != "a" {
			return fmt.Errorf("expected 'a' node, got %s at index %d", aNode.Data, i)
		}

		href, err := findAttribute(aNode, "href")
		if err != nil {
			return fmt.Errorf("failed to find 'href' attribute in node %d: %w", i, err)
		}
		// fmt.Printf("Node %d: %s\n", i+1, href)

		imgNode := aNode.FirstChild
		if imgNode == nil || imgNode.Data != "img" {
			return fmt.Errorf("expected 'img' child node in 'a' node %d, got nil or wrong type", i)
		}

		imgSrc, err := findAttribute(imgNode, "src")
		if err != nil {
			return fmt.Errorf("failed to find 'src' attribute in img node %d: %w", i, err)
		}

		order.Items[i].ProductUrl = href
		order.Items[i].ImageUrl = imgSrc
	}

	return nil
}

func findAttribute(node *html.Node, attr string) (string, error) {
	for _, n := range node.Attr {
		if n.Key == attr {
			return n.Val, nil
		}
	}
	return "", fmt.Errorf("attribute '%s' not found", attr)
}

func parseAmount(line string) (float64, error) {
	// Example: "29.69 EUR"
	if !strings.HasSuffix(line, " EUR") {
		return 0, fmt.Errorf("unexpected currency for amount: %q", line)
	}
	amountStr := strings.TrimSuffix(line, " EUR")
	amount, err := strconv.ParseFloat(amountStr, 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse amount %q: %w", line, err)
	}
	return amount, nil
}

func createBlocks(textContent []byte) [][]string {
	lines := strings.Split(string(textContent), "\n")
	blocks := make([][]string, 0)
	currentBlock := make([]string, 0)

	for _, line := range lines {
		line = strings.TrimSpace(line)

		if line == "" {
			if len(currentBlock) > 0 {
				blocks = append(blocks, currentBlock)
				currentBlock = make([]string, 0)
			}
		} else {
			currentBlock = append(currentBlock, line)
		}
	}

	if len(currentBlock) > 0 {
		blocks = append(blocks, currentBlock)
	}

	return blocks
}
