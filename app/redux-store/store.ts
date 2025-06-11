import { configureStore } from '@reduxjs/toolkit';
import accordionReducer from './accordionSlice';
import accountReducer from './accountSlice';



export const store = configureStore({
  reducer: {
    accordion: accordionReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;