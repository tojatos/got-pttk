import { Routes } from "./Routes";
import { UserRoles } from "./User";

type NavItem = {
  user: UserRoles;
  routes: Array<{
    path: string;
    label: string;
  }>;
};

export const NavConfig: Array<NavItem> = [
  {
    user: UserRoles.GUEST,
    routes: [
      {
        path: Routes.HOME,
        label: "Strona główna",
      },
      {
        path: Routes.PLAN_ROUTE,
        label: "Zaplanuj trasę",
      },
    ],
  },
  {
    user: UserRoles.TOURIST,
    routes: [
      {
        path: Routes.HOME,
        label: "Strona główna",
      },
      {
        path: Routes.PLAN_ROUTE,
        label: "Zaplanuj trasę",
      },
      {
        path: Routes.MANAGE_SEGMENTS,
        label: "Zarządzaj odcinkami",
      },
      {
        path: Routes.MANAGE_ROUTES,
        label: "Zarządzaj trasami",
      },
    ],
  },
  {
    user: UserRoles.LEADER,
    routes: [
      {
        path: Routes.HOME,
        label: "Strona główna",
      },
      {
        path: Routes.PLAN_ROUTE,
        label: "Zaplanuj trasę",
      },
      {
        path: Routes.MANAGE_SEGMENTS,
        label: "Zarządzaj odcinkami",
      },
      {
        path: Routes.MANAGE_ROUTES,
        label: "Zarządzaj trasami",
      },
      {
        path: Routes.VERIFY_ROUTE,
        label: "Weryfikuj trasy",
      },
    ],
  },
];
