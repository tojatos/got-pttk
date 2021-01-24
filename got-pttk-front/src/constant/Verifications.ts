import { Route } from "react-router-dom";

export interface VerificationOfRoute {
  czyPrzodownikUczestniczyl: boolean;
  trasa: Route;
  grupygorskiePrzodownika: string[];
}

export interface VerificationMountainGroup {
  nazwa: string;
  czyzweryfikowana: boolean;
}
