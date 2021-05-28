import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import WebfontLoader from "@dr-kobros/react-webfont-loader";
//import { css } from "@emotion/core";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import { v4 } from "uuid";
//import Home from "./Home";
import Header from "./Header";
import Canvas from "./Canvas";
//import { emptyData, loader } from "../../Actions/canvasActions.js";
import Sidebar from "./Sidebar";
const canvasSize = JSON.parse(sessionStorage.getItem("size"));

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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      cid: this.props.match.params.id,
      cg: this.props.match.params.cg,
      cWidth: 940,
      cHeight: 788,
      zoomValue: 0.5,
      canvasId: v4(),
    };
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.keepOnPage);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.keepOnPage);
    //console.log(this.state.cg);
    if (this.state.cg) {
      const sizeData = JSON.parse(sessionStorage.getItem("size"));

      if (this.state.cg && sizeData) {
        if (this.state.cg == "pos" && sizeData.width !== 1587.4) {
          // console.log("inside");
          this.setState({ cWidth: 1587.4, cHeight: 2245.4 });
          let scale = 584 / 2245.4;
          let canvasSize = {
            width: 1587.4,
            height: 2245.4,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "fly" && sizeData.width !== 793.701) {
          this.setState({ cWidth: 793.701, cHeight: 1122.52 });
          let scale = 584 / 1122.52;
          let canvasSize = {
            width: 793.701,
            height: 1122.52,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "log" && sizeData.width !== 1500) {
          this.setState({ cWidth: 1500, cHeight: 1500 });
          let scale = 584 / 1500;
          let canvasSize = {
            width: 1500,
            height: 1500,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "bus" && sizeData.width !== 321.26) {
          this.setState({ cWidth: 321.26, cHeight: 188.976 });
          let scale = 584 / 188.976;
          let canvasSize = {
            width: 321.26,
            height: 188.976,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "pre" && sizeData.width !== 1920) {
          this.setState({ cWidth: 1920, cHeight: 1080 });
          let scale = 584 / 1080;
          let canvasSize = {
            width: 1920,
            height: 1080,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "soc" && sizeData.width !== 800) {
          this.setState({ cWidth: 800, cHeight: 800 });
          let scale = 584 / 800;
          let canvasSize = {
            width: 800,
            height: 800,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "soc" && sizeData.width !== 800) {
          this.setState({ cWidth: 800, cHeight: 800 });
          let scale = 584 / 800;
          let canvasSize = {
            width: 800,
            height: 800,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "ins" && sizeData.width !== 1080) {
          this.setState({ cWidth: 1080, cHeight: 1920 });
          let scale = 584 / 1920;
          let canvasSize = {
            width: 1080,
            height: 1920,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "you" && sizeData.width !== 1280) {
          this.setState({ cWidth: 1280, cHeight: 720 });
          let scale = 584 / 720;
          let canvasSize = {
            width: 1280,
            height: 720,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "fac" && sizeData.width !== 940) {
          this.setState({ cWidth: 940, cHeight: 788 });
          let scale = 584 / 788;
          let canvasSize = {
            width: 940,
            height: 788,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "inp" && sizeData.width !== 2160) {
          this.setState({ cWidth: 2160, cHeight: 2160 });
          let scale = 584 / 2160;
          let canvasSize = {
            width: 2160,
            height: 2160,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else if (this.state.cg == "cus" && sizeData.width) {
          this.setState({ cWidth: sizeData.width, cHeight: sizeData.height });
          let scale = 584 / sizeData.height;
          let canvasSize = {
            width: sizeData.width,
            height: sizeData.height,
            zoomValue: scale - 0.02,
          };
          sessionStorage.setItem("size", JSON.stringify(canvasSize));
        } else {
          console.log();
        }
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    //  console.log(props);
    let returnState = {};
    if (
      props.showLoader !== undefined &&
      props.showLoader !== state.showLoader
    ) {
      returnState.showLoader = props.showLoader ? props.showLoader : false;
    }
    if (
      props.canvasSize !== undefined &&
      props.canvasSize !== state.canvasSize
    ) {
      if (!props.canvasSize && !canvasSize) {
        props.history.push("/home");
      } else {
        returnState.cWidth = props.canvasSize
          ? props.canvasSize.width
          : canvasSize.width;
        returnState.cHeight = props.canvasSize
          ? props.canvasSize.height
          : canvasSize.height;
        returnState.zoomValue = props.zoomValue
          ? props.zoomValue
          : canvasSize.zoomValue;
      }
    }

    return returnState;
  }

  keepOnPage = (e) => {
    /*var message =
      "Warning!\n\nNavigating away from this page will delete your text if you haven't already saved it.";
    e.returnValue = message;
    //localStorage.removeItem("J-" + this.state.cid);
    // return message;*/
  };

  componentDidUpdate() {}

  callback = (status) => {
    //console.log(status);
    // I could hook the webfont status to for example Redux here.
  };

  render() {
    return (
      <div>
        <WebfontLoader config={config} onStatus={this.callback}>
          <LoadingOverlay
            active={this.state.showLoader}
            text="Preparing Your Video..."
            spinner={<BarLoader size={90} color={"#101010;"} />}
          >
            {/*
              <div className="small-screen">
                <div className="logo_sm">
                  <img src="/img/logo.png" alt="logo" />
                </div>
                <div className="text-sm">
                  Poster Maker app is now available on all iOS &amp; Android
                  devices
                </div>
                <div className="button-sm">
                  <a href="https://apps.apple.com/us/app/poster-flyer-maker-icon-design/id1241339881">
                    <img src="/img/app-store.jpg" alt="app store" />
                  </a>
                </div>
              </div>
           */}

            {
              <div className="" id="wrapper-inner">
                <Header />
                <div className="container-fluid p-0">
                  <div className="canvas-flex">
                    <Sidebar />

                    <Canvas
                      cWidth={this.state.cWidth}
                      cHeight={this.state.cHeight}
                      zoomValue={this.state.zoomValue}
                    />
                  </div>
                </div>
              </div>
            }
          </LoadingOverlay>
        </WebfontLoader>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};
  const data = state.CanvasReducer;
  const homeData = state.HomeReducer;

  if (data) {
    returnState.showLoader = data ? data.showLoader : {};
  }
  if (homeData) {
    returnState.canvasSize = homeData ? homeData.data : {};
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
