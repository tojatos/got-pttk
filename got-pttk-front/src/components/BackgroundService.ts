import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect } from "react";
import { initPoints } from "../app/pointsSlice";
import { initSegments } from "../app/segmentsSlice";
import { clearUserSegments, initUserSegments } from "../app/userSegmentsSlice";
import { clearRoutes, initRoutes } from "../app/routesSlice";
import { initMountainGroups } from "../app/mountainGroupSlice";

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
  useEffect(() => {
    if (!pointsData.pointsInitialized) dispatch(initPoints());
    if (!segmentsData.segmentsInitialized) dispatch(initSegments());
    if (!mountainGroupsData.groupsInitialized) dispatch(initMountainGroups());
    if (authData.login !== null) {
      if (!userSegmentsData.segmentsInitialized) dispatch(initUserSegments());
      if (!routesData.routesInitialized) dispatch(initRoutes());
    } else {
      if (userSegmentsData.segmentsInitialized) dispatch(clearUserSegments());
      if (routesData.routesInitialized) dispatch(clearRoutes());
    }
  }, [
    authData.login,
    dispatch,
    mountainGroupsData.groupsInitialized,
    pointsData.points,
    pointsData.pointsInitialized,
    routesData.routesInitialized,
    segmentsData.segments,
    segmentsData.segmentsInitialized,
    userSegmentsData.segmentsInitialized,
  ]);
  return null;
}
