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
import { loadCanvas } from "../../../Actions/canvasExternalActions.js";
import { getTrends, loadTemplate } from "../../../Actions/templatesActions.js";
import { toolsMenu } from "../../../Actions/canvasActions.js";
//import { parsePointsAttribute } from "fabric/fabric-impl";
import { getVideoElement } from "../Handlers/Handlers.js";

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

class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trendingList: [],
      templateData: {},
    };
  }

  componentDidMount() {
    //this.props.getTrends();
    let today = new Date();
    let formData = {
      start_date: today.toISOString(),
    };
    this.props.getTrends(formData);
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    let cg = "";
    let id = v4();
    let canvasName = "";

    if (
      props.templateData &&
      props.templateData !== state.templateData &&
      props.templateDataDate !== state.templateDataDate
    ) {
      returnState.trendingData = props.templateData ? props.templateData : {};
      returnState.trendingList = props.templateData
        ? props.templateData.data
        : [];
      returnState.templateDaaDate = props.templateDataDate;
    }

    if (
      props.canvasData !== undefined &&
      props.canvasData !== state.canvasData
    ) {
      returnState.canvasData = props.canvasData;
      returnState.canvasObject = props.canvasData
        ? props.canvasData.template
        : "";
      returnState.canvasSize = props.canvasData
        ? props.canvasData.template_size
        : "";
      returnState.canvasCategory = props.canvasData
        ? props.canvasData.category
        : "cus";
      sessionStorage.removeItem(`canvasName`);
      canvasName = props.canvasData ? "" : "";
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
        {/*setTimeout(() => {
          //props.history.push("/");
          let a = document.createElement("a");
          a.target = "_blank";
          a.href = `/design/${id}/edit/${cg}&cat=${random}`;
          a.click();
        }, 0);*/}
        let url = `/design/${id}/edit/${cg}&cat=${random}`;
        let newTab = window.open();
        newTab.location.href = url;
        //  setTimeout(() => {
        //   let url = `/design/${id}/edit/${cg}&cat=${random}`;
        //   // window.open(url, "_blank");
        //   window.open(url, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");

        // }, 0);
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
    console.log(id);
    sessionStorage.removeItem(`size`);
    sessionStorage.removeItem(`canvasName`);
    let formData = {
      id: id,
    };
    this.props.loadTemplate(formData);
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

  onShowMe = (image) => {};

  render() {
    return (
      <div className={"bottomMargin"}>
        <Helmet></Helmet>
        {this.state.trendingList && this.state.trendingList.length && (
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
            <h3 className="list_heading">Trending Designs</h3>
            <div className="design_list swiper-wrapper">
              {this.state.trendingList &&
                this.state.trendingList.length &&
                this.state.trendingList.map((obj, id) => {
                  return (
                    <SwiperSlide key={id} className="design_list_item">
                      {/*<div class="dropdown hover-custom">
                      <span
                        className="delete-button share-button dropdown-toggle"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={() => this.onShowMe(obj.template_image)}
                      >
                        <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                      </span>
                    </div>*/}
                      <div className="list_image_wrapper align-items-start">
                        <img
                          src={obj.template_image}
                          alt="image"
                          onClick={(id) => this.callJson(obj._id)}
                        />
                      </div>
                      {/*<h4 className="list_sm_title">
                      {obj.template_name[2] == "t"
                        ? "Untitled Design"
                        : obj.template_name}
                    </h4>*/}
                      {/*<h6 className="list_sm_desc">
                        Edited on
                        {obj.createdAt
                          ? " " + obj.createdAt.substring(0, 10)
                          : ""}
                      </h6>
                    */}
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

  if (state.TemplateReducer.action === "GET_TRENDS") {
    if (state.TemplateReducer.data.status !== 200) {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.templateData = state.TemplateReducer.data;
      returnState.templateDataDate = new Date();
    }
  }

  if (state.TemplateReducer.action === "LOAD_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.canvasData = state.TemplateReducer.data;
      returnState.canvasDataDate = new Date();
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      toolsMenu: toolsMenu,
      getTrends: getTrends,
      loadTemplate: loadTemplate,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Trending));
