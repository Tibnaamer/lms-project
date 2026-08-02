import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// This protected route component limits access to certain routes for unauthenticated users, for example, if a user is not logged in, they will be redirected to the login page instead.
const ProtectedRoute = (props: RouteProps) => {
  const account = useSelector((state: RootState) => state.auth.account);

  if (account) {
    if (props.path === "/login") {
      return <Redirect to={"/"} />;
    }
    return <Route {...props} />;
  } else {
    return <Redirect to={"/login"} />;
  }
};

export default ProtectedRoute;
