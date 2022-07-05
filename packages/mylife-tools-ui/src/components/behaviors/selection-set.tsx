'use strict';

import { useState } from 'react';
import immutable from 'immutable';

export function useSelectionSet(itemsIdsFactory) {
  const [selection, setSelection] = useState(new immutable.Set());
  const changeSelection = ({ id, selected }) => {
    if(id != null) {
      return setSelection(selected ? selection.add(id) : selection.delete(id));
    }

    return setSelection(selected ? selection.union(itemsIdsFactory()) : selection.clear());
  };

  return [selection, changeSelection];
}
