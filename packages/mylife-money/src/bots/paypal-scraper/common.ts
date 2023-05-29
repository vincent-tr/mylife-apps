import * as shared from '../../../shared/bots';

export type Configuration = shared.PaypalScraper.Configuration;
export type State = shared.PaypalScraper.State;

export interface TransactionItem {
  name: string;
  value: string[];
}

export interface Item {
  description: string[];
  unitPrice: Amount;
  quantity: number;
  amount: Amount;
}

export interface SummaryItem {
  name: string;
  amount: Amount;
}

export interface Amount {
  value: number;
  currency: string;
}

export interface Receipt {
  id: string;
  date: Date;
  amount: number; // EUR
  mailSubject: string;
  url: string;
  transaction: TransactionItem[];
  items: Item[];
  totals: SummaryItem[];
  sources: SummaryItem[];
}
