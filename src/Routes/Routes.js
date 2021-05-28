import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { youLoggedIn } from "../Utils/services.js";

//Dashboard
import Dashboard from "../Components/Dashboard/Dashboard.js";
import Home from "../Components/Dashboard/Home.js";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      youLoggedIn() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) {
      // Rendering error page
      return (
        <div className="main protected">
          <div className="something-wrong">
            {/*<img src="/images/something-wrong.png" />*/}
            <Link to="/logout" className="click-logout">
              Click to Logout
            </Link>
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
    //return this.props.children;
  }
}
const router = (
  <ErrorBoundary>
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Redirect exact path="/login" to="/login" />
      <Redirect exact path="/design/:id/edit/" to="/login" />
      <Redirect exact path="/design/" to="/login" />
      <Redirect exact path="/design/:id" to="/login" />
      <PrivateRoute
        exact
        path="/design/:id/edit/:cg&cat=:cd"
        component={Dashboard}
      />
      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/refer" component={Home} />
      <PrivateRoute exact path="/leaders" component={Home} />
    </Switch>
  </ErrorBoundary>
);

export default router;
