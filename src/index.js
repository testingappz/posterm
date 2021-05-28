import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import "bootstrap/dist/css/bootstrap.min.css";
//import { usePopper } from "react-popper";
//import "./styles/custom_fonts.css";
import thunk from "redux-thunk";
import reducer from "./Reducers/IndexReducer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { Redirect, BrowserHistory, Switch } from "react-router";
import { Router, Route, Link, withRouter } from "react-router-dom";
import { fabric } from "fabric";
import "fabric-history";
import "fabric-customise-controls";
import WebfontLoader from "@dr-kobros/react-webfont-loader";
import App from "./App";
import Routes from "./Routes/Routes.js";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import "./Assets/common.css";
import "./Assets/sidebar.css";
import "./Assets/homeStyle.css";
import "./Assets/newhome.css";
import { youLoggedIn, getUser } from "./Utils/services";
import Login from "./Components/Login/Login.js";
//import LandingPage from "./Components/Home/LandingPage.js";
import ResetPassword from "./Components/Login/ResetPassword";
import PrivacyPolicy from "./Components/Login/PrivacyPolicy";
import TermandConditions from "./Components/Login/TermandConditions";
import ReferDetails from "./Components/Login/ReferDetails";

const store = createStore(reducer, applyMiddleware(thunk));
ReactGA.initialize("UA-171799851-1");
ReactGA.pageview(window.location.pathname + window.location.search);

function auth() {
  let user = JSON.parse(getUser());
  let loggedIn = localStorage.getItem("youLoggedIn");

  if (user && loggedIn) {
    return youLoggedIn();
  } else {
    return false;
  }
}

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !auth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/home",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const config = {
  google: {
    families: [
      "Alfa Slab One",
      "Source Sans Pro:300,600",
      "Grenze Gotisch",
      "Lobster",
      "Dancing Script",
      "Indie Flower",
      "Caveat",
      "Concert One",
      //"Great Vibes",
      "Lexend Zetta",
      "Modak",
      "Raleway",
      "Ultra",
    ],
  },
};

// Callback receives the status of the general webfont loading process. *OPTIONAL*
const callback = (status) => {
  console.log(status);
  // I could hook the webfont status to for example Redux here.
};

const history = createBrowserHistory();
// Get the current location.
const location = history.location;
history.listen((location) => {
  window.ga("set", "page", location.pathname + location.search);
  window.ga("send", "pageview");
});

ReactDOM.render(
  <Provider store={store}>
    <WebfontLoader config={config} onStatus={callback}>
      <Router history={history}>
        <Switch>
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/refer-earn" component={ReferDetails} />
          {/*<PublicRoute exact path="/new-home" component={LandingPage} />*/}
          <PublicRoute exact path="/privacy-policy" component={PrivacyPolicy} />
          <PublicRoute
            exact
            path="/term-conditions"
            component={TermandConditions}
          />
          <PublicRoute path="/refer-friends/:uid/:id" component={Login} />
          {/* <PublicRoute path="/forget-password" component={ForgotPassword} />*/}
          <PublicRoute path="/reset-password/:id" component={ResetPassword} />
          {Routes}
          <Redirect from="/*" to="/login" />
        </Switch>
      </Router>
    </WebfontLoader>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
