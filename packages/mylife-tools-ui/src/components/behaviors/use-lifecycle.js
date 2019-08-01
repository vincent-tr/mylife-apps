'use strict';

import { useEffect } from 'react';

export default function(init, terminate = () => {}) {
  useEffect(() => {
    init();
    return terminate;
  }, []);
}
