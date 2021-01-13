import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { SEGMENTS_URL } from "../constant/Api";
import { SegmentsState } from "../constant/SegmentsState";
import { Segment } from "../constant/Segment";

const initialState: SegmentsState = {
  segmentsInitialized: false,
  segments: null,
};

export const segmentsSlice = createSlice({
  name: "segments",
  initialState,
  reducers: {
    setSegments: (state, action: PayloadAction<SegmentsState>) => {
      state.segments = action.payload.segments;
      state.segmentsInitialized = action.payload.segmentsInitialized;
    },
  },
});

export const { setSegments } = segmentsSlice.actions;

export const initSegments = (): AppThunk => async (dispatch) => {
  try {
    const result = await axios.get(SEGMENTS_URL);
    if (result.status === 200) {
      const segments: Segment[] = result.data;
      dispatch(setSegments({ segments, segmentsInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export default segmentsSlice.reducer;
