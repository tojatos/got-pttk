import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Routes } from "./constant/Routes";
import HomePage from "./screens/Home";
import ManageRoutes from "./screens/ManageRoutes";
import ManageSegments from "./screens/ManageSegments";
import PlanRoute from "./screens/PlanRoute";
import VerifyRoute from "./screens/VerifyRoute";

const routes = [
  {
    path: Routes.HOME,
    component: HomePage,
    exact: true,
  },
  {
    path: Routes.MANAGE_ROUTES,
    component: ManageRoutes,
    exact: false,
  },
  {
    path: Routes.MANAGE_SEGMENTS,
    component: ManageSegments,
    exact: false,
  },
  {
    path: Routes.PLAN_ROUTE,
    component: PlanRoute,
    exact: false,
  },
  {
    path: Routes.VERIFY_ROUTE,
    component: VerifyRoute,
    exact: false,
  },
];

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}
