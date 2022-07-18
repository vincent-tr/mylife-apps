export function createOrchestrator(slideshow) {
  const { order } = slideshow;
  const Orchestrator = ORCHESTRATOR_BY_ORDER[order];
  if(!Orchestrator) {
    throw new Error(`Unknown order: '${order}'`);
  }

  return new Orchestrator();
}

class OrderedStyleOrchestrator {
  private slideshowImages;
  private currentIndex;

  init(slideshowImages) {
    this.slideshowImages = slideshowImages;
    this.currentIndex = -1;
  }

  close() {
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slideshowImages.size;
    return this.slideshowImages.get(this.currentIndex);
  }
}

class RandomStyleOrchestrator {
  private slideshowImages;
  private prevIndex;

  init(slideshowImages) {
    this.slideshowImages = slideshowImages;
    this.prevIndex = -1;
  }

  close() {
  }

  next() {
    if(this.slideshowImages.size < 2) {
      this.prevIndex = 0;
      return this.slideshowImages.get(0);
    }

    // no 2 times same item
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.slideshowImages.size);
    } while(this.prevIndex === nextIndex);

    this.prevIndex = nextIndex;
    return this.slideshowImages.get(nextIndex);
  }
}

const ORCHESTRATOR_BY_ORDER = {
  ordered: OrderedStyleOrchestrator,
  random: RandomStyleOrchestrator,
};
