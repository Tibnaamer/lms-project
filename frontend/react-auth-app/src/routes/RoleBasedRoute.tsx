import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { UserRole } from "../types";

// Component checks if the user is authenticated as well as has the required role to access the route.
type RoleBasedRouteProps = RouteProps & {
  allowedRoles: UserRole[];
};

const RoleBasedRoute = ({ allowedRoles, ...props }: RoleBasedRouteProps) => {
  const account = useSelector((state: RootState) => state.auth.account);

  if (!account) {
    return <Redirect to="/login" />;
  }

  if (!account.role || !allowedRoles.includes(account.role)) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

export default RoleBasedRoute;
