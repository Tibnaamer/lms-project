import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// This component checks if the user is authenticated and redirects to login page if not authenticated
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
