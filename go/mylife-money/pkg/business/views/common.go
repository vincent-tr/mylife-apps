package views

type CriteriaValues map[string]interface{}

type ViewWithCriteria interface {
	SetCriteriaValues(criteriaValues CriteriaValues) error
}
