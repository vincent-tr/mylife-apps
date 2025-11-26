package entities

import "mylife-tools/services/io/serialization"

// ReportTotalByMonth
type ReportTotalByMonth struct {
	id        string
	month     string
	count     float64
	sumDebit  float64
	sumCredit float64
	balance   float64
}

func (stat *ReportTotalByMonth) Id() string {
	return stat.id
}

// Mois
func (stat *ReportTotalByMonth) Month() string {
	return stat.month
}

// Nombre d'opérations
func (stat *ReportTotalByMonth) Value() float64 {
	return stat.count
}

// Débit
func (stat *ReportTotalByMonth) SumDebit() float64 {
	return stat.sumDebit
}

// Crédit
func (stat *ReportTotalByMonth) SumCredit() float64 {
	return stat.sumCredit
}

// Total
func (stat *ReportTotalByMonth) Balance() float64 {
	return stat.balance
}

func (stat *ReportTotalByMonth) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "report-total-by-month")
	helper.Add("_id", stat.id)
	helper.Add("month", stat.month)
	helper.Add("count", stat.count)
	helper.Add("sumDebit", stat.sumDebit)
	helper.Add("sumCredit", stat.sumCredit)
	helper.Add("balance", stat.balance)

	return helper.Build()
}

type ReportTotalByMonthValues struct {
	Id        string
	Month     string
	Count     float64
	SumDebit  float64
	SumCredit float64
	Balance   float64
}

func NewReportTotalByMonth(values *ReportTotalByMonthValues) *ReportTotalByMonth {
	return &ReportTotalByMonth{
		id:        values.Id,
		month:     values.Month,
		count:     values.Count,
		sumDebit:  values.SumDebit,
		sumCredit: values.SumCredit,
		balance:   values.Balance,
	}
}
