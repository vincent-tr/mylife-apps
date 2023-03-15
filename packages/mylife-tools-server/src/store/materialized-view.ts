import { View } from './view';
import { Container } from './container';

export class MaterializedView extends Container {
  constructor(name: string, public readonly entity) {
    super(name);
  }

  createView(filterCallback = () => true) {
    const view = new View(this);
    view.setFilter(filterCallback);
    return view;
  }

  close() {
  }
};
