import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  status: false,
  message: "",
};

const messSlice = createSlice({
  name: "mess",
  initialState,
  reducers: {
    setMess: (s, { payload }: { payload: [boolean, string] }) => {
      s.visible = true;
      s.status = payload[0];
      s.message = payload[1];
    },
    unsetMess: (s) => {
      s.visible = false;
    },
  },
});

export default messSlice.reducer;

export const { setMess, unsetMess } = messSlice.actions;
