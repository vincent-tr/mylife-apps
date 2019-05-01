'use strict';

import { useState, useEffect, useRef } from 'react';

export function useDropdownBehavior(ref) {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef();
  const localRef = useRef();

  // TODO: does it really work ?
  const componentRef = ref || localRef;

  const setOpen = () => setOpened(true);
  const setClose = () => setOpened(false);
  const toggle = () => setOpened(!opened);

  const setSelect = () => {
    setClose();
    // TODO: this is hacky :/
    const node = componentRef.current;
    setTimeout(() => node.focus(), 10);
  };

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

  return [opened, setOpen, setClose, toggle, setSelect, containerRef, componentRef];
}
