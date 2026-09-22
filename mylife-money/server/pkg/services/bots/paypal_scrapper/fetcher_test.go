package paypalscraper

import (
	"os"
	"testing"
)

// The fixture is a synthetic receipt: same structure as a real paypal one, no
// real merchant, account, transaction id or amount in it.
//
// Note: the bot logger is only used on failure paths (transaction id fallback),
// so a zero bot is enough as long as the fixture parses cleanly.

func TestReadForeignCurrencyReceipt(t *testing.T) {
	content, err := os.ReadFile("testdata/foreign_currency.html")
	if err != nil {
		t.Fatalf("failed to read fixture: %s", err)
	}

	b := &bot{}
	r := &receipt{}

	if err := b.processHtmlMessage(r, content); err != nil {
		t.Fatalf("processHtmlMessage failed: %s", err)
	}

	if r.Id != "0AA11111BB222222C" {
		t.Errorf("id: got %q", r.Id)
	}

	// the receipt total is in USD, this is what the merchant was billed
	var total *summaryItem
	for i := range r.Totals {
		if r.Totals[i].Name == "Total" {
			total = &r.Totals[i]
		}
	}
	if total == nil {
		t.Fatalf("no Total row found in %+v", r.Totals)
	}
	if total.Amount.Value != 25 || total.Amount.Currency != "$ USD" {
		t.Errorf("total: got %s, want 25.00 $ USD", total.Amount.String())
	}

	// the amount that actually left the account is in the sources panel
	if len(r.Sources) != 1 {
		t.Fatalf("sources: got %d, want 1: %+v", len(r.Sources), r.Sources)
	}
	if got, want := r.Sources[0].Name, "Banque Exemple - Compte courant ••0000"; got != want {
		t.Errorf("source name: got %q, want %q", got, want)
	}
	if r.Sources[0].Amount.Value != 20 || !isEur(r.Sources[0].Amount.Currency) {
		t.Errorf("source amount: got %s, want 20.00 EUR", r.Sources[0].Amount.String())
	}

	amount, err := receiptAmount(r)
	if err != nil {
		t.Fatalf("receiptAmount failed: %s", err)
	}
	if amount != 20 {
		t.Errorf("amount: got %v, want 20", amount)
	}
}

func TestReceiptAmount(t *testing.T) {
	eur := func(v float64) amount { return amount{Value: v, Currency: "€ EUR"} }
	usd := func(v float64) amount { return amount{Value: v, Currency: "$ USD"} }

	tests := []struct {
		name    string
		totals  []summaryItem
		sources []summaryItem
		want    float64
		wantErr bool
	}{
		{
			name:    "eur total wins over sources",
			totals:  []summaryItem{{Name: "Total", Amount: eur(1.23)}},
			sources: []summaryItem{{Name: "carte", Amount: eur(9.99)}},
			want:    1.23,
		},
		{
			name:    "eur total without any source",
			totals:  []summaryItem{{Name: "Total", Amount: eur(1.23)}},
			want:    1.23,
		},
		{
			name:    "foreign total falls back to the source",
			totals:  []summaryItem{{Name: "Total", Amount: usd(4)}},
			sources: []summaryItem{{Name: "banque", Amount: eur(3.45)}},
			want:    3.45,
		},
		{
			name:    "foreign total with several sources sums them",
			// 1.15 + 2.30 is 3.4499999999999997 in float, so this also covers the rounding
			totals:  []summaryItem{{Name: "Total", Amount: usd(4)}},
			sources: []summaryItem{{Name: "solde", Amount: eur(1.15)}, {Name: "banque", Amount: eur(2.30)}},
			want:    3.45,
		},
		{
			name:    "foreign total without sources is an error",
			totals:  []summaryItem{{Name: "Total", Amount: usd(4)}},
			wantErr: true,
		},
		{
			name:    "foreign total with a foreign source is an error",
			totals:  []summaryItem{{Name: "Total", Amount: usd(4)}},
			sources: []summaryItem{{Name: "solde", Amount: usd(4)}},
			wantErr: true,
		},
		{
			name:    "no total at all is an error",
			totals:  []summaryItem{{Name: "Sous-total", Amount: eur(1.23)}},
			wantErr: true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := receiptAmount(&receipt{Totals: test.totals, Sources: test.sources})

			if test.wantErr {
				if err == nil {
					t.Fatalf("expected an error, got %v", got)
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %s", err)
			}
			if got != test.want {
				t.Errorf("got %v, want %v", got, test.want)
			}
		})
	}
}
