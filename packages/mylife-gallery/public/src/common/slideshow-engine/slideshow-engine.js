'use strict';

const states = {
  PENDING_DOWNLOAD: 1,
  WAITING_INTERVAL: 2
};

const PREFETCH_SIZE = 5;
const INTERVAL = 10000;

const logger = process.env.NODE_ENV === 'production' ? () => {} : logCall;

exports.SlideshowEngine = class SlideshowEngine {
  constructor(slideshow, slideshowImages, nextHandler, mediaAccessor, orchestrator) {
    this.slideshow = slideshow;
    this.slideshowImages = slideshowImages;
    this.nextHandler = nextHandler;
    this.mediaAccessor = mediaAccessor;
    this.orchestrator = orchestrator;

    this.orchestrator.init(this.slideshowImages);

    this.prefetchQueue = [];
    this.timer = null;

    this.mediaUrls = new Map();
    this.controller = new AbortController();

    this.setState(states.PENDING_DOWNLOAD);
    this.fillPrefetch();
  }

  close() {
    clearTimeout(this.timer);

    this.controller.abort();

    for(const url of this.mediaUrls.values()) {
      URL.revokeObjectURL(url);
    }

    this.orchestrator.close();
  }

  setState(state) {
    this.state = state;
    logger(this.slideshow._id, 'setState', stateToString(state));
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
    logger(this.slideshow._id, 'moveToNext', slideshowImage.index);

    // prepare next steps
    this.fillPrefetch();


    this.setState(states.WAITING_INTERVAL);
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
      return;
    }

    // wait for next item to be ready
    this.setState(states.PENDING_DOWNLOAD);
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

const styles = {
  default: 'color: inherit; font-weight: bold',
  lighter: 'color: gray; font-weight: lighter',
  request: 'color: #03A9F4; font-weight: bold',
  result: 'color: #4CAF50; font-weight: bold',
  error: 'color: #F20404; font-weight: bold',
};

function logCall(id, action, ...args) {
  /* eslint-disable no-console */
  const formattedArgs = args.map(arg => `${arg}`).join(' ');
  console.log(`%c slidehow-engine ${id} %c${action} %c${formattedArgs}`, styles.lighter, styles.default, styles.lighter);
  /* eslint-enable */
}

function stateToString(state) {
  switch(state) {
    case states.PENDING_DOWNLOAD:
      return 'PENDING_DOWNLOAD';
    case states.WAITING_INTERVAL:
      return 'WAITING_INTERVAL';
    default:
      return state.toString();
  }
}
