import { Route } from "../constant/Route";
import { RouteSegment } from "../constant/RouteSegment";
import { Segment } from "../constant/Segment";
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

export const segmentsToString = (
  s: Array<RouteSegment>,
  allSegments: Segment[],
  route: Route
) => {
  const id1 = route.polaczeniatrasy.find((p) => p.kolejnosc === 1)
    ?.polaczenieid;
  const n1 = allSegments?.find((s) => s.id === id1)?.nazwa || "";
  if (s.length === 1) return n1;
  const id2 = route.polaczeniatrasy.find((p) => p.kolejnosc === s.length)
    ?.polaczenieid;
  const n2 = allSegments?.find((s) => s.id === id2)?.nazwa || "";
  return `${n1} - ${n2}`;
};
