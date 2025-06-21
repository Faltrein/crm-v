import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailAddModal: false,
};

const emailSlice = createSlice({
  name: 'emailCli',
  initialState,
  reducers: {
    addEmailModal(state) {
       state.emailAddModal = !state.emailAddModal;
    },
  },
});

export const {  addEmailModal} = emailSlice.actions;
export default emailSlice.reducer;