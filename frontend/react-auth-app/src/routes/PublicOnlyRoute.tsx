import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// This public only route component restricts access to certain routes for authenticated users, for example, if a user is logged in, 
// they will be redirected to the dashboard instead of being able to access the login or signup pages.
const PublicOnlyRoute = (props: RouteProps) => {
  const account = useSelector((state: RootState) => state.auth.account);

  if (account) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

export default PublicOnlyRoute;