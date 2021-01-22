import { SegmentPoint } from "./SegmentPoint";

export type Segment = {
  id: number;
  nazwa: string;
  punktyz: number;
  punktydo: number;
  grupagorska: string;
  punktypolaczenia: SegmentPoint[];
};

export interface SegmentData {
  id?: number;
  nazwa: string;
  punktyz: number;
  punktydo: number;
  grupagorska: string;
  punktypolaczenia: SegmentPoint[];
}
