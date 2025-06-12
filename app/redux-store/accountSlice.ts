import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hesla: null as string | null,
  isSubnavOpen: false,
  kontakt: null as string | null,
  adresa: null as string | null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
     setSubnavOpen(state, action) {
      state.isSubnavOpen = action.payload;
    },
    toggleHesla(state) {
      state.hesla = state.hesla === '0' ? null : '0';
    },
    toggleKontakt(state) {
      state.kontakt = state.kontakt === '0' ? null : '0';
    },
    toggleAdresa(state) {
      state.adresa = state.adresa === '0' ? null : '0';
    },
  },
});

export const { setSubnavOpen, toggleHesla, toggleAdresa, toggleKontakt } = accountSlice.actions;
export default accountSlice.reducer;