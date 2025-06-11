import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeKey: null as string | null,
  isSubnavOpen: false,
  difKeyTest: null as string | null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
     setSubnavOpen(state, action) {
      state.isSubnavOpen = action.payload;
    },
  },
});

export const { setSubnavOpen } = accountSlice.actions;
export default accountSlice.reducer;