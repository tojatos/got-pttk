import { RouteSegment } from "./RouteSegment";

export interface Route {
  id: number;
  nazwa: string;
  datarozpoczecia: string;
  datazakonczenia: string;
  polaczeniatrasy: RouteSegment[];
}