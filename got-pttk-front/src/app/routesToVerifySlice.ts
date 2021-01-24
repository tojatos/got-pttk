import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { ROUTES_TO_VERIFY_URL } from "../constant/Api";
import { RoutesState } from "../constant/RoutesState";
import { Route } from "../constant/Route";
import { setRoutes } from "./routesSlice";

const initialState: RoutesState = {
  routesInitialized: false,
  routes: null,
};

export const routesToVerifySlice = createSlice({
  name: "routes_to_verify",
  initialState,
  reducers: {
    setRoutesToVerify: (state, action: PayloadAction<RoutesState>) => {
      state.routes = action.payload.routes;
      state.routesInitialized = action.payload.routesInitialized;
    },
    invalidateRoutesToVerify: (state) => {
      state.routesInitialized = false;
    },
  },
});

export const {
  setRoutesToVerify,
  invalidateRoutesToVerify,
} = routesToVerifySlice.actions;

export const initRoutesToVerify = (): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    const result = await axios.get(ROUTES_TO_VERIFY_URL, {
      headers: {
        Authorization: "Bearer " + getState().authData.token,
      },
    });
    if (result.status === 200) {
      const routes: Route[] = result.data;
      if (
        getState().routesToVerifyData.routesInitialized &&
        getState().routesToVerifyData.routes?.length === routes.length
      )
        return; // no change
      dispatch(setRoutesToVerify({ routes, routesInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export const clearRoutesToVerify = (): AppThunk => async (dispatch) =>
  dispatch(setRoutesToVerify({ routes: null, routesInitialized: false }));

export default routesToVerifySlice.reducer;
