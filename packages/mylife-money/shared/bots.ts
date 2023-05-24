export namespace CicScraper {
  export interface Configuration {
    user: string;
    pass: string;
    account: string; // account in Money
  }
  
  export interface State {
    agent: string[];
    lastDownload: {
      date: Date,
      content: string,
    }
  }
}

export namespace FraisScraper {
  export interface Configuration {
    imapServer: string;
    imapUser: string;
    imapPass: string;
    mailbox: string;
    subject: string;
    from: string;
    sinceDays: number;

    parser: 'julie' | 'vincent';

    account: string; // account in Money
    matchDaysDiff: number; // max number of days before/after to find match
    template: string; // template notes
  }

  export interface State {
  }
}

export namespace AmazonScraper {
  export interface Configuration {
    imapServer: string;
    imapUser: string;
    imapPass: string;
    mailbox: string;
    from: string;
    sinceDays: number;

    account: string; // account in Money
    matchDaysDiff: number; // max number of days before/after to find match
    matchLabel: string;
    template: string; // template notes
  }

  export interface State {
  }

}