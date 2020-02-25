import Strategy from './strategy';
import { Datasource, Resolution } from './datasource';
import MovingDataset from './moving-dataset';


export default class Strategy1 implements Strategy {
  private datasource: Datasource;
  private dataset: MovingDataset;

  async init() {
    this.datasource = new Datasource({ key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true });
    await this.datasource.init();
    console.log('datasource init');

    this.dataset = await this.datasource.getDataset('CS.D.EURUSD.CFD.IP', Resolution.MINUTE, 15);
    this.dataset.on('error', err => console.error('ERROR', err));
    this.dataset.on('add', record => console.log(record));

    this.dataset.on('update', record => console.log('UPDATE', record));

    for (const record of this.dataset.list) {
      console.log(record);
    }

  }

  async terminate() {
    this.dataset.close();
    await this.datasource.terminate();
    console.log('datasource terminate');
  }
}

