import { Resolution } from '../broker';
import { Timeline } from './timeline';

export interface Configuration {
  readonly instrumentId: string;
  readonly resolution: Resolution; // always m1
  readonly spread: number;
}

export default class Engine {
  public readonly timeline: Timeline;

  constructor(public readonly configuration: Configuration) {
  }

  init() {

  }

  terminate() {

  }
}