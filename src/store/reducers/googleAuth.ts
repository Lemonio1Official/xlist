import { createSlice } from "@reduxjs/toolkit";

const initialState: { auth: any } = {
  auth: null,
};

const googleAuth = createSlice({
  name: "googleAuth",
  initialState,
  reducers: {
    setGAuth: (s, { payload }: { payload: any }) => {
      s.auth = payload;
    },
  },
});

export default googleAuth.reducer;

export const { setGAuth } = googleAuth.actions;
