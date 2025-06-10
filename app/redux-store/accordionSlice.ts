import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeKey: null as string | null,
};

const accordionSlice = createSlice({
  name: 'accordion',
  initialState,
  reducers: {
    toggleAccordion(state) {
      state.activeKey = state.activeKey === '0' ? null : '0';
    },
    setActiveKey(state, action) {
      state.activeKey = action.payload;
    },
  },
});

export const { toggleAccordion, setActiveKey } = accordionSlice.actions;
export default accordionSlice.reducer;