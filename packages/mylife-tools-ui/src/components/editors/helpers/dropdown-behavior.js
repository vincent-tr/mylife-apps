'use strict';

import { useState, useEffect, useRef } from 'react';

export function useDropdownBehavior() {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef();

  const setOpen = () => setOpened(true);
  const setClose = () => setOpened(false);
  const toggle = () => setOpened(!opened);

  useEffect(() => {
    function handleDocumentClick() {
      const node = containerRef.current;
      if(!node) {
        return;
      }
      if(node.contains(event.target)) {
        return;
      }
      setClose();
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('touchend', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  });

  return [opened, setOpen, setClose, toggle, containerRef];
}
