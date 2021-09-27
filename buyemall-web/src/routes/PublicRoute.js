import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const UserRoute = ({ children, ...rest })=> {

  // Redux hooks
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (!user && !user.token) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default UserRoute;