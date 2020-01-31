'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Slideshows from './slideshows/components';
import Slideshow from './slideshow/components';
import SlideshowTitle from './slideshow/components/title';
import Suggestions from './suggestions/components';
import Browse from './browse/components';
import Stats from './stats/components';
import Album from './album/components';
import AlbumTitle from './album/components/title';
import AlbumAdditionalHeader from './album/components/additional-header';
import Persons from './persons/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/album/:albumId', name: (<AlbumTitle />), icon: icons.menu.Album, additionalHeader: (<AlbumAdditionalHeader />), renderer: ({ albumId }) => <Album albumId={albumId} /> },
  { location: '/slideshows', name: 'Diaporamas', icon: icons.menu.Slideshows, renderer: () => <Slideshows /> },
  { location: '/slideshow/:slideshowId', name: (<SlideshowTitle />), icon: icons.menu.Slideshows, renderer: ({ slideshowId }) => <Slideshow slideshowId={slideshowId} />},
  { location: '/browse', name: 'Parcourir', icon: icons.menu.Browse, renderer: () => <Browse /> },
  { location: '/persons', name: 'Personnes', icon: icons.menu.Person, renderer: () => <Persons /> },
  { location: '/suggestions', name: 'Suggestions', icon: icons.menu.Suggestions, renderer: () => <Suggestions /> },
  { location: '/stats', name: 'Statistics', icon: icons.menu.Stats, renderer: () => <Stats /> },
];
/* eslint-enable */

const menu = [
  { id: 'slideshows', text: 'Diaporamas', icon: icons.menu.Slideshows, location: '/slideshows' },
  { id: 'browse', text: 'Parcourir', icon: icons.menu.Browse, location: '/browse' },
  { id: 'persons', text: 'Personnes', icon: icons.menu.Person, location: '/persons' },
  { id: 'suggestions', text: 'Suggestions', icon: icons.menu.Suggestions, location: '/suggestions' },
  { id: 'stats', text: 'Statistics', icon: icons.menu.Stats, location: '/stats' },
];

services.render({
  appIcon: icons.Gallery,
  appName: 'Gallery',
  routes,
  menu
});
