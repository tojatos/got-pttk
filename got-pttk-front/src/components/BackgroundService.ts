import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useCallback, useEffect } from "react";
import { initPoints } from "../app/pointsSlice";
import { initSegments } from "../app/segmentsSlice";
import { clearUserSegments, initUserSegments } from "../app/userSegmentsSlice";
import { clearRoutes, initRoutes } from "../app/routesSlice";
import { initMountainGroups } from "../app/mountainGroupSlice";
import {
  clearRoutesToVerify,
  initRoutesToVerify,
} from "../app/routesToVerifySlice";
import { UserRole } from "../constant/User";

export default function BackgroundService() {
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.authData);
  const pointsData = useSelector((state: RootState) => state.pointsData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const mountainGroupsData = useSelector(
    (state: RootState) => state.mountainGroupsData
  );
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const routesData = useSelector((state: RootState) => state.routesData);
  const routesToVerifyData = useSelector(
    (state: RootState) => state.routesToVerifyData
  );
  useEffect(() => {
    if (!pointsData.pointsInitialized) dispatch(initPoints());
    if (!segmentsData.segmentsInitialized) dispatch(initSegments());
    if (!mountainGroupsData.groupsInitialized) dispatch(initMountainGroups());
    if (authData.login !== null) {
      if (!userSegmentsData.segmentsInitialized) dispatch(initUserSegments());
      if (!routesData.routesInitialized) dispatch(initRoutes());
      if (
        authData.role === UserRole.LEADER &&
        !routesToVerifyData.routesInitialized
      )
        dispatch(initRoutesToVerify());
    } else {
      if (userSegmentsData.segmentsInitialized) dispatch(clearUserSegments());
      if (routesData.routesInitialized) dispatch(clearRoutes());
      if (routesToVerifyData.routesInitialized) dispatch(clearRoutesToVerify());
    }
  }, [
    authData.login,
    authData.role,
    dispatch,
    mountainGroupsData.groupsInitialized,
    pointsData.points,
    pointsData.pointsInitialized,
    routesData.routesInitialized,
    routesToVerifyData.routesInitialized,
    segmentsData.segments,
    segmentsData.segmentsInitialized,
    userSegmentsData.segmentsInitialized,
  ]);

  const checkTimeout = 15000;
  const checkForNewRoutes = useCallback(() => {
    if (authData.role === UserRole.LEADER) dispatch(initRoutesToVerify());
    setTimeout(checkForNewRoutes, checkTimeout);
  }, [authData.role, dispatch]);

  useEffect(() => {
    checkForNewRoutes();
  }, [checkForNewRoutes]);
  return null;
}
