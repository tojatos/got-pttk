import { Segment } from "./Segment";

export interface SegmentsState {
  segmentsInitialized: boolean;
  segments: Segment[] | null;
}
