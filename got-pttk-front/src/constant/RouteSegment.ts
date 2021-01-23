import { Segment } from "./Segment";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

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

export const dataToRouteSegment = (rsd: RouteSegmentData): RouteSegment => ({
  id: 0,
  polaczenieid: rsd.polaczenie.id,
  czypowrotne: rsd.czypowrotne,
  kolejnosc: rsd.kolejnosc,
});
