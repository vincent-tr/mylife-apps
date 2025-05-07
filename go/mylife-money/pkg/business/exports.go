package business

import (
	"bytes"
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
	"slices"
	"strings"

	"github.com/tealeg/xlsx/v3"
)

type DisplayValues map[string]interface{}

type display struct {
	fullnames    bool
	invert       bool
	monthAverage bool
	withParent   bool
}

func parseDisplay(displayValues DisplayValues) (*display, error) {
	d := &display{}
	displayReader := views.NewCriteriaReader(views.CriteriaValues(displayValues))

	fullnames, err := displayReader.GetBool("fullnames", false)
	if err != nil {
		return nil, err
	}
	d.fullnames = fullnames

	invert, err := displayReader.GetBool("invert", false)
	if err != nil {
		return nil, err
	}
	d.invert = invert

	monthAverage, err := displayReader.GetBool("monthAverage", false)
	if err != nil {
		return nil, err
	}
	d.monthAverage = monthAverage

	withParent, err := displayReader.GetBool("withParent", false)
	if err != nil {
		return nil, err
	}
	d.withParent = withParent

	return d, nil
}

func ExportGroupByMonth(session *sessions.Session, criteria views.CriteriaValues, displayValues DisplayValues) ([]byte, error) {
	view, err := views.MakeGroupByMonth()
	if err != nil {
		return nil, err
	}

	viewWithCriteria := view.(views.ViewWithCriteria)
	criteria["noChildSub"] = true
	if err := viewWithCriteria.SetCriteriaValues(criteria); err != nil {
		return nil, err
	}

	display, err := parseDisplay(displayValues)
	if err != nil {
		return nil, err
	}

	amountTransformer := func(value float64) float64 {
		return value
	}

	return exportGroupByPeriod(view, display, amountTransformer)
}

func ExportGroupByYear(session *sessions.Session, criteria views.CriteriaValues, displayValues DisplayValues) ([]byte, error) {
	view, err := views.MakeGroupByYear()
	if err != nil {
		return nil, err
	}

	viewWithCriteria := view.(views.ViewWithCriteria)
	criteria["noChildSub"] = true
	if err := viewWithCriteria.SetCriteriaValues(criteria); err != nil {
		return nil, err
	}

	display, err := parseDisplay(displayValues)
	if err != nil {
		return nil, err
	}

	var amountTransformer func(float64) float64
	if display.monthAverage {
		amountTransformer = func(value float64) float64 {
			return views.RoundCurrency(value / 12)
		}
	} else {
		amountTransformer = func(value float64) float64 {
			return value
		}
	}

	return exportGroupByPeriod(view, display, amountTransformer)
}

type group struct {
	root    string
	child   string
	display string
}

func exportGroupByPeriod(view store.IView[*entities.ReportGroupByPeriod], display *display, amountTransform func(float64) float64) ([]byte, error) {
	periodItems := view.List()
	if len(periodItems) == 0 {
		return writeXlsx([][]any{{}})
	}

	slices.SortFunc(periodItems, func(a, b *entities.ReportGroupByPeriod) int {
		return strings.Compare(a.Period(), b.Period())
	})

	groups := make([]group, 0)
	for root, item := range periodItems[0].Groups() {
		displayValue, err := groupDisplay(root, false, display)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group{root: root, display: displayValue})

		for child, _ := range item.Children {
			displayValue, err := groupDisplay(child, true, display)
			if err != nil {
				return nil, err
			}
			groups = append(groups, group{root: root, child: child, display: displayValue})
		}
	}

	header := []any{""}
	for _, periodItem := range periodItems {
		header = append(header, periodItem.Period())
	}

	data := [][]any{header}

	for _, group := range groups {
		row := []any{group.display}

		for _, periodItem := range periodItems {
			item := periodItem.Groups()[group.root]
			if group.child != "" {
				item = item.Children[group.child]
			}
			value := item.Amount
			if display.invert {
				value = -value
			}
			value = amountTransform(value)
			row = append(row, value)
		}

		data = append(data, row)
	}
	return writeXlsx(data)
}

func groupDisplay(id string, withParent bool, display *display) (string, error) {
	if id == "null" {
		return "Non triés", nil
	}

	groups, err := store.GetCollection[*entities.Group]("groups")
	if err != nil {
		return "", err
	}

	if display.fullnames {
		currentId := &id
		names := make([]string, 0)

		for currentId != nil {
			group, err := groups.Get(*currentId)
			if err != nil {
				return "", err
			}

			names = append(names, group.Display())
			currentId = group.Parent()
		}

		slices.Reverse(names)
		return strings.Join(names, "/"), nil
	}

	group, err := groups.Get(id)
	if err != nil {
		return "", err
	}

	if !display.withParent || group.Parent() == nil {
		return group.Display(), nil
	}

	parent, err := groups.Get(*group.Parent())
	if err != nil {
		return "", err
	}

	return parent.Display() + "/" + group.Display(), nil
}

func writeXlsx(data [][]any) ([]byte, error) {
	wb := xlsx.NewFile()
	sheet, err := wb.AddSheet("Sheet1")
	if err != nil {
		return nil, err
	}

	for _, row := range data {
		xlsxRow := sheet.AddRow()
		for _, cell := range row {
			xlsxCell := xlsxRow.AddCell()
			xlsxCell.SetValue(cell)
		}
	}

	var buffer bytes.Buffer
	if err := wb.Write(&buffer); err != nil {
		return nil, err
	}

	return buffer.Bytes(), nil
}
