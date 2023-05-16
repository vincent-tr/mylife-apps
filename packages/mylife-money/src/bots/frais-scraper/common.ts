import { createLogger } from 'mylife-tools-server';
import * as shared from '../../../shared/bots';

export type Configuration = shared.FraisScraper.Configuration;
export type State = shared.FraisScraper.State;

export const logger = createLogger('mylife:money:bots:frais-scraper');

export interface FileMetadata {
  mailId: string;
  mailDate: Date;
  mailFrom: string;
  mailSubject: string;
  filename: string;
}

export interface File {
  data: Buffer;
  metadata: FileMetadata;
}

export interface Item {
  amount: number;
  date: Date;
  keywords: string[];
  metadata: FileMetadata & { sheetName: string; [key: string]: any; }
}