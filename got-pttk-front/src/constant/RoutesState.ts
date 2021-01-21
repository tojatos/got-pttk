import { Route } from "./Route";

export interface RoutesState {
  routesInitialized: boolean;
  routes: Route[] | null;
}
