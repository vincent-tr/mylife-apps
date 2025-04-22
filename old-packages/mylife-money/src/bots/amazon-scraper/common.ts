import * as shared from '../../../shared/bots';

export type Configuration = shared.AmazonScraper.Configuration;
export type State = shared.AmazonScraper.State;

export interface Order {
  id: string;
  date: Date;
  amount: number;
  orderUrl: string;
  items: {
    productUrl: string;
    imageUrl: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[]
}
