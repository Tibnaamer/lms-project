import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../store";

// PublicOnlyRoute component that restricts access to certain routes for authenticated users. If a user is already logged in, 
// they will be redirected to the dashboard instead the login or signup pages.
const PublicOnlyRoute = (props: RouteProps) => {
  const account = useSelector((state: RootState) => state.auth.account);

  if (account) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

export default PublicOnlyRoute;