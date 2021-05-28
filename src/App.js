import ReactGA from "react-ga";
import React, { Component } from "react";
import { Redirect, BrowserHistory, Switch } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard.js";
import Home from "./Components/Dashboard/Home.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      youLoggedIn: false,
    };
    if (localStorage.getItem("youLoggedIn") == 1) {
    }

    ReactGA.initialize("UA-171799851-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    const img = new Image();
    img.src = "/new-home/new-body-bg.webp";
    img.alt = "background-image";
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/design/:id/edit/:cg&cat=:cd"
            component={Dashboard}
          />
          <Route exact path="/home" component={Home} />
          <Redirect from="/*" to="/login" />
        </Switch>
      </Router>
    );
  }
}

export default App;
