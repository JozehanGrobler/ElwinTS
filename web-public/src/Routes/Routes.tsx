import React from "react";
import {
  Switch,
  Route,
  BrowserRouter,
  RouteProps,
  Redirect,
} from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import { HomePage } from "../Pages/HomePage/Homepage";
import { LoginPage } from "../Pages/Login/Login";
import { RegistrationPage } from "../Pages/RegistrationPage/RegistrationPage";
import { ResetPassword } from "../Pages/ResetPassword/ResetPassword";

export function PrivateRoute(props: RouteProps) {
  const { authenticated } = useAuthContext();
  if (!authenticated) {
    return <Redirect to="/login" />;
  }
  return <Route {...props}>{props.children}</Route>;
}
export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegistrationPage />
        </Route>
        <Route exact path="/resetPassword">
          <ResetPassword />
        </Route>
        <PrivateRoute path="/">
          <HomePage />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
