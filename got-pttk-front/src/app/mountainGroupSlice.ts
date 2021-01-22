import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { MOUNTAIN_GROUPS_URL, POINTS_URL } from "../constant/Api";
import { PointsState } from "../constant/PointsState";
import { Point } from "../constant/Point";
import { MountainGroupState } from "../constant/MountainGroupState";

const initialState: MountainGroupState = {
  groupsInitialized: false,
  groups: [],
};

export const mountainGroupSlice = createSlice({
  name: "mountain_groups",
  initialState,
  reducers: {
    setMountainGroups: (state, action: PayloadAction<MountainGroupState>) => {
      state.groups = action.payload.groups;
      state.groupsInitialized = action.payload.groupsInitialized;
    },
  },
});

export const { setMountainGroups } = mountainGroupSlice.actions;

export const initMountainGroups = (): AppThunk => async (dispatch) => {
  try {
    const result = await axios.get(MOUNTAIN_GROUPS_URL);
    if (result.status === 200) {
      const groups: string[] = result.data.map(
        ({ nazwa }: { nazwa: string }) => nazwa
      );
      dispatch(setMountainGroups({ groups, groupsInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export default mountainGroupSlice.reducer;
