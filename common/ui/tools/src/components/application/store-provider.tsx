import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { getStore } from '../../services/store-factory';

export default function StoreProvider({ children }: PropsWithChildren) {
  return <Provider store={getStore()}>{children}</Provider>;
}
