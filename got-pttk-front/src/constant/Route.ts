import { RouteSegment } from "./RouteSegment";

export interface Route {
  id: number;
  nazwa: string;
  datarozpoczecia: string | null;
  datazakonczenia: string | null;
  polaczeniatrasy: RouteSegment[];
}

export interface RouteFormData {
  nazwa: string;
  datarozpoczecia: string | null;
  datazakonczenia: string | null;
}
