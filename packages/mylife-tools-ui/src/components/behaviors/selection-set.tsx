import { useState, useCallback } from 'react';
import immutable from 'immutable';

export function useSelectionSet(itemsIdsFactory: () => Iterable<string>): [immutable.Set<string>, (change: { id: string; selected: boolean }) => void] {
  const [selection, setSelection] = useState(immutable.Set<string>());

  const changeSelection = useCallback(({ id, selected }: { id: string; selected: boolean }) => setSelection(selection => {
    if (id != null) {
      return setSelection(selected ? selection.add(id) : selection.delete(id));
    } else {
      return setSelection(selected ? selection.union(itemsIdsFactory()) : selection.clear());
    }
  }), [setSelection]);

  return [selection, changeSelection];
}
