'use strict';

exports.createOrchestrator = (slideshow) => {
  const { style } = slideshow;
  const Orchestrator = ORCHESTRATOR_BY_STYLE[style];
  if(!Orchestrator) {
    throw new Error(`Unknown style: '${style}'`);
  }

  return new Orchestrator();
};

class OrderedStyleOrchestrator {
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
  init(slideshowImages) {
    this.slideshowImages = slideshowImages;
    this.prevIndex = -1;
  }

  close() {
  }

  next() {
    if(this.slideshowImages.size < 2) {
      this.prevIndex = 0;
      return 0;
    }

    // no 2 times same item
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.slideshowImages.size);
    } while(this.prevIndex === nextIndex);

    this.prevIndex = nextIndex;
    return nextIndex;
  }
}

const ORCHESTRATOR_BY_STYLE = {
  'scrolling-ordered': OrderedStyleOrchestrator,
  'scrolling-random': RandomStyleOrchestrator,
};
