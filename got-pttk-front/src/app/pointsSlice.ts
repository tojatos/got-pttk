import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { POINTS_URL } from "../constant/Api";
import { PointsState } from "../constant/PointsState";
import { Point } from "../constant/Point";

const initialState: PointsState = {
  pointsInitialized: false,
  points: null,
};

export const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<PointsState>) => {
      state.points = action.payload.points;
      state.pointsInitialized = action.payload.pointsInitialized;
    },
  },
});

export const { setPoints } = pointsSlice.actions;

export const initPoints = (): AppThunk => async (dispatch) => {
  try {
    const result = await axios.get(POINTS_URL);
    if (result.status === 200) {
      const points: Point[] = result.data;
      dispatch(setPoints({ points, pointsInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export default pointsSlice.reducer;
