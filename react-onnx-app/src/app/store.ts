import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import imageReducer from "./imageState";

export const store = configureStore({
  reducer: {
    images: imageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
