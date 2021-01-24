import { RouteSegment, RouteSegmentData } from "../constant/RouteSegment";
import { Segment } from "../constant/Segment";
import { last, head } from "lodash";
import { Route } from "../constant/Route";
import { pointsToString, segmentsToString } from "./converter";

export const calculatePoints = (
  segments: Array<RouteSegment>,
  segmentsData: Segment[]
) =>
  segments
    .map((s) => {
      const segment = segmentsData?.find((se) => se.id === s.id);
      return s.czypowrotne ? segment?.punktyz || 0 : segment?.punktydo || 0;
    })
    .reduce((a, b) => a + b, 0);

export const calculatePointsFromData = (segments: Array<RouteSegmentData>) =>
  segments
    .map((s) => {
      return s.czypowrotne
        ? s.polaczenie?.punktyz || 0
        : s.polaczenie?.punktydo || 0;
    })
    .reduce((a, b) => a + b, 0);

const isConnected = (a: RouteSegmentData, b: RouteSegmentData) => {
  return (
    (!a.czypowrotne
      ? last(a.polaczenie?.punktypolaczenia)
      : head(a.polaczenie?.punktypolaczenia)
    )?.punkttrasy.nazwa ===
    (b.czypowrotne
      ? last(b.polaczenie?.punktypolaczenia)
      : head(b.polaczenie?.punktypolaczenia)
    )?.punkttrasy.nazwa
  );
};

export const checkRouteConsistency = (polaczeniatrasy: RouteSegmentData[]) => {
  const lastIndex = polaczeniatrasy.length - 1;
  return !polaczeniatrasy.some(
    (e, i) => i !== lastIndex && !isConnected(e, polaczeniatrasy[i + 1])
  );
};

export const filtredSegments = (searchedText: string, list: Segment[]) => {
  const searched = searchedText.toLowerCase();
  const searchPredicate = (item: Segment) =>
    item.nazwa.toLowerCase().includes(searched) ||
    pointsToString(item.punktypolaczenia).toLowerCase().includes(searched) ||
    item.grupagorska.toLowerCase().includes(searched);

  return list.filter(searchPredicate);
};

export const filtredRoutes = (
  searchedText: string,
  list: Route[],
  allSegments: Segment[]
) => {
  const searched = searchedText.toLowerCase();
  const searchPredicate = (item: Route) =>
    item.nazwa.toLowerCase().includes(searched) ||
    segmentsToString(item.polaczeniatrasy, allSegments, item)
      .toLowerCase()
      .includes(searched);

  return list.filter(searchPredicate);
};
