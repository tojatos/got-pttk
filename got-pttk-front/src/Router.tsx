import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Routes } from "./constant/Routes";
import EditSegment from "./screens/EditSegment";
import HomePage from "./screens/Home";
import ManageRoutes from "./screens/ManageRoutes";
import ManageSegments from "./screens/ManageSegments";
import PlanRoute from "./screens/PlanRoute";
import VerifyRoute from "./screens/VerifyRoute";
import CustomRoute from "./components/CustomRoute";
import { UserRole } from "./constant/User";
import EditRoute from "./screens/EditRoute";
import VerifyUserRoute from "./screens/VerifyUserRoute";

const routes = [
  {
    path: Routes.HOME,
    component: HomePage,
    exact: true,
    allowedRoles: [UserRole.GUEST, UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.MANAGE_ROUTES,
    component: ManageRoutes,
    exact: false,
    allowedRoles: [UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.MANAGE_SEGMENTS,
    component: ManageSegments,
    exact: false,
    allowedRoles: [UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.PLAN_ROUTE,
    component: PlanRoute,
    exact: false,
    allowedRoles: [UserRole.GUEST, UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.VERIFY_ROUTE,
    component: VerifyRoute,
    exact: true,
    allowedRoles: [UserRole.LEADER],
  },
  {
    path: Routes.VERIFY_ROUTE_OF_USER,
    component: VerifyUserRoute,
    exact: false,
    allowedRoles: [UserRole.LEADER],
  },
  {
    path: Routes.EDIT_SEGMENT,
    component: EditSegment,
    exact: false,
    allowedRoles: [UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.ADD_SEGMENT,
    component: EditSegment,
    exact: false,
    allowedRoles: [UserRole.TOURIST, UserRole.LEADER],
  },
  {
    path: Routes.EDIT_ROUTE,
    component: EditRoute,
    exact: false,
    allowedRoles: [UserRole.TOURIST, UserRole.LEADER],
  },
];

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, i) => (
          <CustomRoute key={i} {...route} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}
