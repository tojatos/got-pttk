import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./store";
import { ROUTE_URL } from "../constant/Api";
import { RoutesState } from "../constant/RoutesState";
import { Route } from "../constant/Route";

const initialState: RoutesState = {
  routesInitialized: false,
  routes: null,
};

export const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<RoutesState>) => {
      state.routes = action.payload.routes;
      state.routesInitialized = action.payload.routesInitialized;
    },
    invalidateRoutes: (state) => {
      state.routesInitialized = false;
    },
  },
});

export const { setRoutes, invalidateRoutes } = routesSlice.actions;

export const initRoutes = (): AppThunk => async (dispatch, getState) => {
  try {
    const result = await axios.get(ROUTE_URL, {
      headers: {
        Authorization: "Bearer " + getState().authData.token,
      },
    });
    if (result.status === 200) {
      const routes: Route[] = result.data;
      dispatch(setRoutes({ routes, routesInitialized: true }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export const clearRoutes = (): AppThunk => async (dispatch) =>
  dispatch(setRoutes({ routes: null, routesInitialized: false }));

export default routesSlice.reducer;
