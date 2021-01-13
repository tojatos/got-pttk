import { Point } from "./Point";

export interface PointsState {
  pointsInitialized: boolean;
  points: Point[] | null;
}
