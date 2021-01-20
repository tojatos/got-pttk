import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";

import authReducer from "./authSlice";
import pointsReducer from "./pointsSlice";
import segmentsReducer from "./segmentsSlice";
import userSegmentsReducer from "./userSegmentsSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
};

const persistedRootReducer = persistCombineReducers(persistConfig, {
  authData: authReducer,
  pointsData: pointsReducer,
  segmentsData: segmentsReducer,
  userSegmentsData: userSegmentsReducer,
});

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    },
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
