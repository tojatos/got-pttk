import { SegmentPoint } from "./SegmentPoint";

export interface Segment {
  id: number;
  nazwa: string;
  punktyz: number;
  punktydo: number;
  grupagorska: string;
  punktypolaczenia: SegmentPoint[];
}
