import { Routes } from "./Routes";
import { UserRole } from "./User";

type NavItem = {
  user: UserRole;
  routes: Array<{
    path: string;
    label: string;
  }>;
};

export const NavConfig: Array<NavItem> = [
  {
    user: UserRole.GUEST,
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
    user: UserRole.TOURIST,
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
    user: UserRole.LEADER,
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
