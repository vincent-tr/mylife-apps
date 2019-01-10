'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Dialogs = () => (
  <div>
    <div>
      <components.Button>Error</components.Button>
      <components.Button>Info</components.Button>
      <components.Button>Slow process</components.Button>
      <components.Button>Custom</components.Button>
    </div>
    <div>
      <components.Button>Message Info</components.Button>
      <components.Button>Message Warning</components.Button>
      <components.Button>Message Error</components.Button>
    </div>
  </div>
);

Dialogs.meta = {
  icon: null,
  title: 'Dialogs'
};

export default Dialogs;
