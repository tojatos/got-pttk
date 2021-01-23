import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { UserRole } from "../constant/User";
import { Routes } from "../constant/Routes";

export default function CustomRoute({
  allowedRoles,
  ...props
}: {
  allowedRoles: string[];
}) {
  const authData = useSelector((state: RootState) => state.authData);
  const role = authData.role || UserRole.GUEST;
  if (allowedRoles.includes(role)) {
    return <Route {...props} />;
  }
  return <Redirect to={Routes.HOME} />;
}
