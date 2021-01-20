import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect } from "react";
import { initPoints } from "../app/pointsSlice";
import { initSegments } from "../app/segmentsSlice";
import { initUserSegments } from "../app/userSegmentsSlice";

export default function BackgroundService() {
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.authData);
  const pointsData = useSelector((state: RootState) => state.pointsData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  useEffect(() => {
    if (!pointsData.pointsInitialized) dispatch(initPoints());
    if (!segmentsData.segmentsInitialized) dispatch(initSegments());
    if (authData.login !== null) {
      if (!userSegmentsData.segmentsInitialized) dispatch(initUserSegments());
    }
  }, [
    authData.login,
    dispatch,
    pointsData.points,
    pointsData.pointsInitialized,
    segmentsData.segments,
    segmentsData.segmentsInitialized,
    userSegmentsData.segmentsInitialized,
  ]);
  return null;
}
