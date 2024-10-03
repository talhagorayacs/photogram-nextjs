// components/Providers.tsx
'use client';

import { Provider } from 'react-redux';
import  store  from '@/store/store'; // Adjust the path as necessary

export function Providers({ children } ) {
  return <Provider store={store}>{children}</Provider>;
}
