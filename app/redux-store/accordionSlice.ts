import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeKey: null as string | null,
  isSubnavOpen: false,
  difKeyTest: null as string | null,
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
      toggleDifAcc(state) {
      state.difKeyTest = state.difKeyTest === '0' ? null : '0';
    },
      setDiffKeyTest(state, action) {
      state.difKeyTest = action.payload;
    },
    setSubnavOpen(state, action) {
      state.isSubnavOpen = action.payload;
    },
  },
});

export const { toggleAccordion, setActiveKey, setSubnavOpen, setDiffKeyTest, toggleDifAcc } = accordionSlice.actions;
export default accordionSlice.reducer;