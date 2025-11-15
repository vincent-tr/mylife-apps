import { ActionCreatorsMapObject, ActionCreator, bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import React, { useMemo } from 'react';

export function fireAsync(target) {
  target().catch((err) => console.error('Unhandled promise rejection', err)); // eslint-disable-line no-console
}

export class AbortError extends Error {}

// throws AbortError if aborted
export async function abortableDelay(delay: number, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    let timer;

    const abortHandler = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abortHandler);
      reject(new AbortError());
    };

    signal.addEventListener('abort', abortHandler);

    timer = setTimeout(() => {
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
  return useMemo(
    () => bindActionCreators(action, dispatch),
    [dispatch]
  );
}

export function useActions<A, M extends ActionCreatorsMapObject<A>>(actions: M): M {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions, dispatch),
    [dispatch]
  );
}
