import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/styles.css";
import Login from "views/Login/Login";
import {userAuth as auth} from "services/auth";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route
        path="/admin"
        render={() =>
          auth.isAuthenticated ? (
            <Admin />
          ) : (
            <Redirect from="/admin" to="/login" />
          )
        }
      />
      <Route
        path="/login"
        render={() =>
          !auth.isAuthenticated ? (
            <Login />
          ) : (
            <Redirect from="/login" to="/admin" />
          )
        }
      />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
