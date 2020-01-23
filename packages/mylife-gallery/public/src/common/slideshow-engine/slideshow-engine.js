'use strict';

const states = {
  PENDING_DOWNLOAD: 1,
  WAITING_INTERVAL: 2
};

const PREFETCH_SIZE = 5;
const INTERVAL = 5000;

exports.SlideshowEngine = class SlideshowEngine {
  constructor(slideshowImages, nextHandler, mediaAccessor, orchestrator) {
    this.slideshowImages = slideshowImages;
    this.nextHandler = nextHandler;
    this.mediaAccessor = mediaAccessor;
    this.orchestrator = orchestrator;

    this.orchestrator.init(this.slideshowImages);

    this.prefetchQueue = [];
    this.timer = null;

    this.mediaUrls = new Map();
    this.controller = new AbortController();

    this.state = states.PENDING_DOWNLOAD;
  }

  close() {
    clearTimeout(this.timer);

    this.controller.abort();

    for(const url of this.urls.values()) {
      URL.revokeObjectURL(url);
    }

    this.orchestrator.close();
  }

  fillPrefetch() {
    while(this.prefetchQueue.length < PREFETCH_SIZE) {
      const slideshowImage = this.orchestrator.next();
      this.prefetchQueue.push(slideshowImage);
      this.startFetchUrl(slideshowImage);
    }
  }

  moveToNext() {
    const slideshowImage = this.prefetchQueue.shift();
    const url = this.mediaUrls.get(slideshowImage._id);
    this.nextHandler(url);

    // prepare next steps
    this.fillPrefetch();

    this.state = states.WAITING_INTERVAL;
    this.timer = setTimeout(() => this.onTimeout(), INTERVAL);
  }

  isNextReady() {
    const slideshowImage = this.prefetchQueue[0];
    return !!this.mediaUrls.get(slideshowImage._id);
  }

  onTimeout() {
    this.timer = null;

    if(this.isNextReady()) {
      this.moveToNext();
    }

    // wait for next item to be ready
    this.state = states.PENDING_DOWNLOAD;
  }

  startFetchUrl(slideshowImage) {
    const id = slideshowImage._id;
    if(this.mediaUrls.get(id)) {
      return;
    }

    const url = this.mediaAccessor(slideshowImage);
    safeFetchUrl(url, this.controller, objectUrl => this.endFetchUrl(slideshowImage, objectUrl));
  }

  endFetchUrl(slideshowImage, objectUrl) {
    this.mediaUrls.set(slideshowImage._id, objectUrl);

    // if we are waiting for this item, let's move to next
    if(this.state === states.PENDING_DOWNLOAD && this.prefetchQueue[0] === slideshowImage) {
      this.moveToNext();
    }
  }
};

async function safeFetchUrl(url, controller, setter) {
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP error, status = ${response.status}`);
    }

    const blob = await response.blob();

    // only set if not aborted
    if(controller.signal.aborted) {
      return;
    }

    setter(URL.createObjectURL(blob));
  } catch(err) {
    if(controller.signal.aborted) {
      return;
    }

    console.error(`Error fetch url ${url}`, err); // eslint-disable-line no-console
  }
}
