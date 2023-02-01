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