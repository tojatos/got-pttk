import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { USER_SEGMENTS_URL } from "../constant/Api";
import { SegmentsState } from "../constant/SegmentsState";
import { Segment } from "../constant/Segment";

const initialState: SegmentsState = {
  segmentsInitialized: false,
  segments: null,
};

export const userSegmentsSlice = createSlice({
  name: "user_segments",
  initialState,
  reducers: {
    setUserSegments: (state, action: PayloadAction<SegmentsState>) => {
      state.segments = action.payload.segments;
      state.segmentsInitialized = action.payload.segmentsInitialized;
    },
  },
});

export const { setUserSegments } = userSegmentsSlice.actions;

export const initUserSegments = (): AppThunk => async (dispatch, getState) => {
  try {
    const result = await axios.get(USER_SEGMENTS_URL, {
      headers: {
        Authorization: "Bearer " + getState().authData.token,
      },
    });
    if (result.status === 200) {
      const segments: Segment[] = result.data;
      dispatch(setUserSegments({ segments, segmentsInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export default userSegmentsSlice.reducer;
