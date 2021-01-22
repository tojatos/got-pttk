import { initUserSegments } from "../app/userSegmentsSlice";
import { RouteSegmentData } from "../constant/RouteSegment";
import { SegmentPoint } from "../constant/SegmentPoint";

export const pointsToString = (points: Array<SegmentPoint>) =>
  (points.find((p) => p.kolejnosc === 1)?.punkttrasy.nazwa || "") +
  " - " +
  points.find((p) => p.kolejnosc === points.length)?.punkttrasy.nazwa;

export const isSegment = (seg: any) => {
  return "nazwa" in seg && "punktypolaczenia" in seg;
};

export const isRouteSegmentData = (seg: any) => {
  return "polaczenie" in seg && "czypowrotne" in seg && "kolejnosc" in seg;
};
