import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
 
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Users from "views/admin/Users"; 
import Login from "views/auth/Login"; 

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/auth" component={Auth} />
      <PrivateRoute path="/admin" component={Admin} />
      <Route path="/auth/login" component={Login} />
      <PrivateRoute path="/admin/users" component={Users} />
      <Redirect from="*" to="/auth/login" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
