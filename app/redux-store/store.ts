import { configureStore } from '@reduxjs/toolkit';
import accordionReducer from './accordionSlice';
import accountReducer from './accountSlice';
import emailReducer from './emailCliSlice';


export const store = configureStore({
  reducer: {
    accordion: accordionReducer,
    account: accountReducer,
    email: emailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;