import { services } from 'mylife-tools';
import icons from './common/icons';
import Home from './home/components';
import Live from './live/components';
import Stats from './stats/components';
import statsReducer from './stats/store';
import Tesla from './tesla/components';

const reducers = {
  stats: statsReducer,
};

services.initStore(reducers);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/live', name: 'Live', icon: icons.tabs.Live, renderer: () => <Live /> },
  { location: '/stats', name: 'Stats', icon: icons.tabs.Stats, renderer: () => <Stats /> },
  { location: '/tesla', name: 'Tesla', icon: icons.tabs.Tesla, renderer: () => <Tesla /> },
];

const menu = [
  { id: 'live', text: 'Live', icon: icons.tabs.Live, location: '/live' },
  { id: 'stats', text: 'Stats', icon: icons.tabs.Stats, location: '/stats' },
  { id: 'tesla', text: 'Tesla', icon: icons.tabs.Tesla, location: '/tesla' },
];

services.render({
  appIcon: icons.Energy,
  appName: 'Energy',
  routes,
  menu,
});
