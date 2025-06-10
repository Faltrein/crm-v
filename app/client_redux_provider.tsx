'use client';

import { Provider } from 'react-redux';
import { store } from 'app/redux-store/store';

export default function ClientReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}