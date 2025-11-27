import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from '../../services/store-factory';

export interface StoreProviderProps {
  children?: React.ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => <Provider store={getStore()}>{children}</Provider>;

export default StoreProvider;
