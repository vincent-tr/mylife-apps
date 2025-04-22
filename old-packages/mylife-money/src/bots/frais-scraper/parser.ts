import * as XLSX from 'xlsx';

import { BotExecutionContext } from '../api';
import { Configuration, Item, File } from './common';

interface Header {
  key: string;
  signature: string[];
}

export abstract class Parser {
  private readonly headerStart: number;
  private readonly headerEnd: number;
  private readonly headers: Header[];

  constructor(headers: Header[], headerStart: number) {
    this.headers = headers;
    this.headerStart = headerStart;
    this.headerEnd = headerStart + headers[0].signature.length;
  }

  abstract parse(context: BotExecutionContext, configuration: Configuration, file: File): Item[];

  protected buildKeywords(...values: string[]) {
    const words = values.join(' ').toLowerCase().split(/\s+/);
    return words.filter(word => word.length > 3);
  }

  protected processSheet(context: BotExecutionContext, worksheet: XLSX.WorkSheet, file: File, sheetName: string) {
    const size = this.computeWorksheetSize(worksheet);

    // context.log('debug', `size = ${JSON.stringify(size)}`);

    if (size.r < this.headerEnd) {
      throw new Error(`Sheet does not contain enough rows (${size.r})`);
    }

    const headers = this.findHeaders(worksheet, size);

    // read until amount = 0 || undefined
    const rows: { [key: string]: any; }[] = [];
    for (let row = this.headerEnd; row <= size.r; ++row) {
      const rowValues: { [key: string]: any; } = {};

      for (const [key, col] of Object.entries(headers)) {
        rowValues[key] = this.getCell(worksheet, { r: row, c: col })?.v;
      }

      if (!rowValues.amount) {
        break;
      }

      rowValues.index = row + 1;

      rows.push(rowValues);
    }

    return rows;
  }

  private computeWorksheetSize(worksheet: XLSX.WorkSheet) {
    const size = { c: -1, r: -1 };

    for (const address of Object.keys(worksheet)) {
      if (address.startsWith('!')) {
        continue;
      }

      const addr = XLSX.utils.decode_cell(address);
      size.c = Math.max(size.c, addr.c);
      size.r = Math.max(size.r, addr.r);
    }

    return size;
  }

  private getCell(worksheet: XLSX.WorkSheet, address: XLSX.CellAddress) {
    const addr = XLSX.utils.encode_cell(address);

    const cell = worksheet[addr];
    if (cell) {
      return cell;
    }

    // check from merged cells
    for (const merge of worksheet['!merges'] || []) {
      if (this.isInRange(merge, address)) {
        return worksheet[XLSX.utils.encode_cell(merge.s)];
      }
    }

    return undefined;
  }

  private isInRange(range: XLSX.Range, cell: XLSX.CellAddress) {
    return cell.c >= range.s.c && cell.c <= range.e.c
      && cell.r >= range.s.r && cell.r <= range.e.r;
  }

  private findHeaders(worksheet: XLSX.WorkSheet, size: XLSX.CellAddress) {
    const headers: { [key: string]: number; } = {};

    for (let col = 0; col <= size.c; ++col) {
      const header: string[] = [];

      // headers are on rows 3..6
      for (let row = this.headerStart; row < this.headerEnd; ++row) {
        const address = { c: col, r: row };
        //const addr = XLSX.utils.encode_cell(address);
        const cell = this.getCell(worksheet, address);

        header.push(cell?.v);
      }

      const key = this.findHeader(header);
      if (!key) {
        continue;
      }

      if (headers[key] !== undefined) {
        throw new Error(`Multiple columns found for header '${key}'`);
      }

      headers[key] = col;
    }

    const founds = Object.keys(headers);
    const expected = new Set(this.headers.map(h => h.key));
    if (founds.length !== expected.size) {
      throw new Error(`Missing headers. Found only '${founds.join(', ')}' (${founds.length} != ${expected.size})`);
    }

    return headers;
  }

  private findHeader(cells: string[]) {
    for (const { key, signature } of this.headers) {
      let equal = true;

      for (let i = 0; i < signature.length; ++i) {
        if (!this.equalsHeaderValues(cells[i], signature[i])) {
          equal = false;
          break;
        }
      }

      if (equal) {
        return key;
      }
    }
  }

  private equalsHeaderValues(left: string, right: string) {
    return (left || '').replace(/\s/g, '').toLowerCase() === (right || '').replace(/\s/g, '').toLowerCase();
  }

  protected parseDate(value: number) {
    const utcDays = Math.floor(value - 25569);
    const utcValue = utcDays * 86400;
    return new Date(utcValue * 1000);
  }

  protected parseAmount(value: number) {
    return Math.round(value * 100) / 100;
  }
}

export class JulieParser extends Parser {
  constructor() {
    super(
      [
        { key: 'id', signature: ['PIECE', 'NUMERO', undefined] },
        { key: 'date', signature: ['DATE', undefined, undefined] },
        { key: 'type', signature: ['L I E U   E T   M O T I F', ' (heures de début et fin de mission)', 'Type dépense'] },
        { key: 'type', signature: ['L I E U   E T   M O T I F', undefined, 'Type dépense'] },
        { key: 'provider', signature: [undefined, ' (heures de début et fin de mission)', 'Fournisseur'] },
        { key: 'provider', signature: [undefined, undefined, 'Fournisseur'] },
        { key: 'customer', signature: [undefined, ' (heures de début et fin de mission)', 'Lieux, Entreprise'] },
        { key: 'customer', signature: [undefined, undefined, 'Client / lieu'] },
        { key: 'amount', signature: [undefined, 'Contrôle', undefined] }
      ],
      3
    );
  }

  parse(context: BotExecutionContext, configuration: Configuration, file: File) {
    const workbook = XLSX.read(file.data);
    const items: Item[] = [];

    for (const sheetName of workbook.SheetNames) {
      if (!sheetName.includes('NDF')) {
        context.log('debug', `Sheet name does not contains NDF, ignored: '${sheetName}'`);
        continue;
      }

      context.log('info', `Processing sheet '${sheetName}'`);

      const worksheet = workbook.Sheets[sheetName];

      try {
        const rows = this.processSheet(context, worksheet, file, sheetName);

        for (const row of rows) {
          const date = this.parseDate(row.date);
          const amount = this.parseAmount(row.amount);

          const metadata = {
            ...file.metadata,
            sheetName,
            rowIndex: row.index,
            rowId: row.id,
            rowType: row.type,
            rowProvider: row.provider,
            rowCustomer: row.customer,
          };

          items.push({
            metadata,
            keywords: this.buildKeywords(row.type, row.provider, row.customer),
            amount,
            date,
          });
        }

      } catch (err) {
        context.log('error', `Error processing sheet: '${err.stack}'`);
      }
    }

    return items;
  }
}

export class VincentParser extends Parser {
  constructor() {
    super(
      [
        { key: 'provider', signature: ['Vendor'] },
        { key: 'amount', signature: [' Local amount'] },
        { key: 'date', signature: ['Date'] },
        { key: 'category', signature: ['Category'] },
      ],
      0
    );
  }

  parse(context: BotExecutionContext, configuration: Configuration, file: File) {
    const workbook = XLSX.read(file.data);
    const items: Item[] = [];
    const sheetName = 'Expenses';

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      context.log('warning', `Sheet not found: '${sheetName}', ignored`);
      return [];
    }
  
    context.log('info', `Processing sheet '${sheetName}'`);
  
    try {
      const rows = this.processSheet(context, worksheet, file, sheetName);

      for (const row of rows) {
        const date = this.parseDate(row.date);
        const amount = this.parseAmount(row.amount);

        const metadata = {
          ...file.metadata,
          sheetName,
          rowIndex: row.index,
          rowProvider: row.provider,
          rowCategory: row.category,
        };

        items.push({
          metadata,
          keywords: this.buildKeywords(row.provider, row.category),
          amount,
          date,
        });
      }

      return items;

    } catch (err) {
      context.log('error', `Error processing sheet: '${err.stack}'`);
      return [];
    }
  }
}
