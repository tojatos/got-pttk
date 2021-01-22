import { SegmentPoint } from "./SegmentPoint";

export type Segment = {
  id: number;
  nazwa: string;
  punktyz: number;
  punktydo: number;
  grupagorska: string;
  punktypolaczenia: SegmentPoint[];
};
