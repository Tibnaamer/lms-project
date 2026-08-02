import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { UserRole } from "../types";

// This role based route component restricts the access to certain routes based on the user's role, for example if a user does not have the required role, 
// they will be redirected to the dashboard or login page.
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
