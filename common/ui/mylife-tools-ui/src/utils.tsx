import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, ActionCreator, bindActionCreators } from 'redux';

export function fireAsync(target) {
  target().catch((err) => console.error('Unhandled promise rejection', err)); // eslint-disable-line no-console
}

export class AbortError extends Error {}

// throws AbortError if aborted
export async function abortableDelay(delay: number, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const abortHandler = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abortHandler);
      reject(new AbortError());
    };

    signal.addEventListener('abort', abortHandler);

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abortHandler);
      resolve();
    }, delay);
  });
}

export function addLineBreaks(values) {
  if (typeof values === 'string') {
    values = values.split('\n');
  }

  return values.map((text, index) => (
    <React.Fragment key={index}>
      {text}
      {index < values.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function useAction<A, C extends ActionCreator<A>>(action: C): C {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(action, dispatch), [dispatch, action]);
}

export function useActions<A, M extends ActionCreatorsMapObject<A>>(actions: M): M {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => bindActionCreators(actions, dispatch), [dispatch, ...Object.values(actions)]);
}
