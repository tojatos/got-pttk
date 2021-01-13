import { SegmentPoint } from "./SegmentPoint";

export interface Segment {
  id: number;
  name: string;
  punktyz: number;
  punktydo: number;
  grupagorska: string;
  punktypolaczenia: SegmentPoint[];
}
