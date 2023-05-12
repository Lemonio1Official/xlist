import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import googleAuth from "./reducers/googleAuth";
import messSlice from "./reducers/messSlice";
import userSlice from "./reducers/userSlice";

export type rootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  googleAuth,
  messSlice,
  userSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: [],
      },
      serializableCheck: false,
    }),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector;

export default store;
