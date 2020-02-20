interface Strategy {
  init(): Promise<void>;
  terminate(): Promise<void>;
}
