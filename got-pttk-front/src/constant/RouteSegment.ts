import { Segment } from "./Segment";

export interface RouteSegment {
  id: number;
  polaczenieid: number;
  czypowrotne: boolean;
  kolejnosc: number;
}

export interface RouteSegmentData {
  polaczenie: Segment;
  czypowrotne: boolean;
  kolejnosc: number;
}
