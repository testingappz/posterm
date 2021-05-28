import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Helmet } from "react-helmet";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { v4 } from "uuid";
import lzwCompress from "lzwcompress";
import {
  loadCanvas,
  getUserCanvas,
  deleteCanvas,
  socialShareCount,
} from "../../../Actions/canvasExternalActions.js";
import { toolsMenu } from "../../../Actions/canvasActions.js";
//import { parsePointsAttribute } from "fabric/fabric-impl";

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
var isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var isBlink = isChrome && !!window.CSS;

class RecentDesign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCanvasList: [],
      userCanvas: {},
    };
  }

  componentDidMount() {
    this.props.getUserCanvas();
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    let cg = "";
    let id = v4();
    let canvasName = "";

    if (
      props.userCanvas &&
      props.userCanvas !== state.userCanvas &&
      props.userCanvasDate !== state.userCanvasDate
    ) {
      returnState.userCanvas = props.userCanvas ? props.userCanvas : {};
      returnState.userCanvasList = props.userCanvas
        ? props.userCanvas.data
        : [];
      returnState.userCanvasDate = props.userCanvasDate;
      //console.log(props.userCanvas);
      /*if (returnState.userCanvas.deleted && props.callData == true) {
        props.getUserCanvas();

        returnState.callData = false;
      }*/
    }

    if (
      props.canvasData !== undefined &&
      props.canvasData !== state.canvasData
    ) {
      returnState.canvasData = props.canvasData;
      returnState.canvasObject = props.canvasData
        ? props.canvasData.canvas_object
        : "";
      returnState.canvasSize = props.canvasData
        ? props.canvasData.canvas_size
        : "";
      returnState.canvasCategory = props.canvasData
        ? props.canvasData.category
        : "cus";
      sessionStorage.removeItem(`canvasName`);
      canvasName = props.canvasData ? props.canvasData.canvas_name : "";
      id = props.canvasData ? props.canvasData._id : v4();
      cg = returnState.canvasCategory;

      let random = Math.random().toString(36).substring(7);
      sessionStorage.setItem(`size`, returnState.canvasSize);
      if (canvasName[0] !== "u" && canvasName[0] !== "U") {
        //console.log(canvasName);
        sessionStorage.setItem(`canvasName`, canvasName);
      }
      lzwCompress.unpack(
        sessionStorage.setItem("J-" + id, returnState.canvasObject)
      );
      if (!isFirefox) {
        setTimeout(() => {
          //props.history.push("/");
          let a = document.createElement("a");
          a.target = "_blank";
          a.href = `/design/${id}/edit/${cg}&cat=${random}`;
          a.click();
        }, 0);
      }
      if (isFirefox) {
        setTimeout(() => {
          let url = `/design/${id}/edit/${cg}&cat=${random}`;
          window.open(url, "_blank");
        }, 0);
      }
      setTimeout(() => {
        sessionStorage.removeItem("J-" + id);
      }, 3000);
    }

    return returnState;
  }

  callJson = (id) => {
    sessionStorage.removeItem(`size`);
    sessionStorage.removeItem(`canvasName`);
    let formData = {
      id: id,
    };
    this.props.loadCanvas(formData);
  };

  deleteUserCanvas = (e, id) => {
    e.preventDefault();

    if (id) {
      this.props.deleteCanvas(id);
    }
  };

  posterShared = (value, image) => {
    let userDetails = this.props.userInfo ? this.props.userInfo : {};
    let formData = {
      shared_on: value ? value : "",
      name: userDetails.name,
      email: userDetails.email,
      shared_template: image ? image : "",
    };
    this.props.socialShareCount(formData);
  };

  render() {
    return (
      <div
        className={
          this.state.userCanvasList && this.state.userCanvasList.length
            ? "bottomMargin"
            : "noDisplay"
        }
      >
        <Helmet></Helmet>
        {this.state.userCanvasList && this.state.userCanvasList.length && (
          <Swiper
            spaceBetween={30}
            slidesPerView={"auto"}
            slidesPerGroup={6}
            simulateTouch={false}
            navigation={{
              nextEl: ".swiper-button-recent-next",
              prevEl: ".swiper-button-recent-prev",
            }}
            //pagination={{ clickable: true }}
            //scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log("sd")}
            onSlideChange={() => console.log("d")}
            className={"recent_designs"}
          >
            <h3 className="list_heading">Your Designs</h3>
            <div className="design_list swiper-wrapper">
              {this.state.userCanvasList &&
                this.state.userCanvasList.map((obj, id) => {
                  return (
                    <SwiperSlide key={id} className="design_list_item">
                      <div class="dropdown hover-custom">
                        <span
                          className="delete-button share-button dropdown-toggle"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <div
                          class="dropdown-menu dropdown_custom dropdown_custom_right dropdown-menu-right dropdown-custom-sm "
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a class="dropdown-item drop_item">
                            <TwitterShareButton
                              url={
                                obj.canvas_share
                                  ? obj.canvas_share
                                  : obj.canvas_image
                                  ? obj.canvas_image
                                  : ""
                              }
                              title={`Hey, I have just created the design over Poster Maker`}
                              hashtag="#postermaker"
                              via="postermaker"
                              style={{ width: "100%", textAlign: "left" }}
                              onShareWindowClose={(value, image) =>
                                this.posterShared("twitter", obj.canvas_image)
                              }
                              disabled={obj.canvas_image ? false : true}
                            >
                              <span data-href="https://posterapplab.com">
                                Share on Twitter
                              </span>
                            </TwitterShareButton>
                          </a>
                          <a class="dropdown-item drop_item">
                            <FacebookShareButton
                              url={
                                obj.canvas_share
                                  ? obj.canvas_share
                                  : obj.canvas_image
                                  ? obj.canvas_image
                                  : ""
                              }
                              quote={`Hey, I have just created the design over Poster Maker ${
                                obj.canvas_share
                                  ? obj.canvas_share
                                  : obj.canvas_image
                                  ? obj.canvas_image
                                  : ""
                              }`}
                              hashtag="#postermaker"
                              style={{ width: "100%" }}
                              onShareWindowClose={(value, image) =>
                                this.posterShared("facebook", obj.canvas_image)
                              }
                              disabled={obj.canvas_image ? false : true}
                            >
                              <span data-href="https://posterapplab.com">
                                Share on Facebook
                              </span>
                            </FacebookShareButton>
                          </a>
                          <a
                            class="dropdown-item drop_item"
                            onClick={(e, id) =>
                              this.deleteUserCanvas(e, obj._id)
                            }
                          >
                            Delete
                          </a>
                        </div>
                      </div>

                      <div className="list_image_wrapper align-items-start">
                        <img
                          src={obj.canvas_image}
                          alt="image"
                          onClick={(id) => this.callJson(obj._id)}
                        />
                      </div>
                      <h4 className="list_sm_title">
                        {obj.canvas_name[2] == "t"
                          ? "Untitled Design"
                          : obj.canvas_name}
                      </h4>
                      {
                        <h6 className="list_sm_desc">
                          Edited on
                          {obj.createdAt
                            ? " " + obj.createdAt.substring(0, 10)
                            : ""}
                        </h6>
                      }
                    </SwiperSlide>
                  );
                })}
            </div>
            <div className="swiper-button-next swiper-button-recent-next"></div>
            <div className="swiper-button-prev swiper-button-recent-prev"></div>
          </Swiper>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let returnState = {};

  if (state.CanvasExternalReducer.action === "LOAD_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.canvasData = state.CanvasExternalReducer.data;
      //console.log(canvasData);
    }
  }

  if (state.CanvasExternalReducer.action === "GET_ALL_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "200") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userCanvas = state.CanvasExternalReducer.data;
      returnState.userCanvasDate = new Date();
      // console.log(returnState.userCanvas);
    }
  }

  if (state.CanvasExternalReducer.action === "DELETE_USER_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "200") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userCanvas = state.CanvasExternalReducer.data;
      returnState.userCanvasDate = new Date();
      returnState.callData = true;
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadCanvas: loadCanvas,
      getUserCanvas: getUserCanvas,
      toolsMenu: toolsMenu,
      deleteCanvas: deleteCanvas,
      socialShareCount: socialShareCount,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RecentDesign));
