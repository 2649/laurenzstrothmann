import { createSlice } from "@reduxjs/toolkit";
import { imageCardObject } from "../util/types";
import {
  saveImageState,
  removeImageState,
  loadImageState,
  saveStateIds,
  loadStateIds,
} from "../util/localStateHandler";

export const imageSlice = createSlice({
  name: "images",
  initialState: {
    images: loadStateIds()
      .map((id: string) => loadImageState(id))
      .filter((el: imageCardObject | null) => el !== null),
  },
  reducers: {
    updateImage: (state, action) => {
      state.images = state.images.map((el: imageCardObject) =>
        el.id === action.payload.id ? action.payload : el
      );
      saveImageState(action.payload);
    },
    addImage: (state, action) => {
      state.images = [...state.images, action.payload];
      saveImageState(action.payload);
      saveStateIds(state.images.map((el: imageCardObject) => el.id));
    },
    removeImage: (state, action) => {
      state.images = [
        ...state.images.filter(
          (el: imageCardObject) => el.id !== action.payload.id
        ),
      ];
      removeImageState(action.payload.id);
      saveStateIds(state.images.map((el: imageCardObject) => el.id));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addImage, updateImage, removeImage } = imageSlice.actions;

export default imageSlice.reducer;
