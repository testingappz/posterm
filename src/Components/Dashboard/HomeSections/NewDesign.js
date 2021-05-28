import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { v4 } from "uuid";
import { setCanvasSize } from "../../../Actions/HomeActions";

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

class NewDesign extends Component {
  selectSize = (width, height, category) => {
    sessionStorage.removeItem(`canvasName`);
    let random = Math.random().toString(36).substring(7);
    let cg = category;
    let id = v4();
    if (width && height) {
      let scale = 584 / height;

      let formData = {
        width: width,
        height: height,
        zoomValue: scale - 0.02,
      };
      //console.log(scale);
      this.props.setCanvasSize(formData);
      let canvasSize = {
        width: width,
        height: height,
        zoomValue: scale - 0.02,
      };

      sessionStorage.setItem("size", JSON.stringify(canvasSize));
      // localStorage.removeItem("J");
    }
    if (!isFirefox) {
      let url = `/design/${id}/edit/${cg}&cat=${random}`;
      let newTab = window.open();
      newTab.location.href = url;
      // function redirectToTemplate(){
      //   let url = `/design/${id}/edit/${cg}&cat=${random}`;
      //   window.open(url, "_blank");
      // }
      // $('.redirect_button').addEvent('click', redirectToTemplate);

      // setTimeout(() => {
      //   let a = document.createElement("a");
      //   a.target = "_blank";
      //   a.href = `/design/${id}/edit/${cg}&cat=${random}`;
      //   a.click();
      // }, 0);
      // setTimeout(() => {
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
    //this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <button className="redirect_button" type="button" style={{display: "none"}}/>

        <Swiper
          spaceBetween={30}
          slidesPerView={"auto"}
          slidesPerGroup={6}
          simulateTouch={false}
          navigation={{
            nextEl: ".swiper-button-canvas-next",
            prevEl: ".swiper-button-canvas-prev",
          }}
          //pagination={{ clickable: true }}
          //scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log()}
          onSlideChange={() => console.log("")}
          className={"create_new_design"}
        >
          <h3 className="list_heading">Create a new design</h3>

          <div className="canvas_list swiper-wrapper">
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(1587.4, 2245.4, "pos")}
            >
              <img
                className="list_sm_image"
                src="./home-img/poster.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Poster</h4>
              <h6 className="list_sm_desc">1587 x 2245 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(793.701, 1122.52, "fly")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Flyer.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Flyer</h4>
              <h6 className="list_sm_desc">793 x 1122 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(1500, 1500, "log")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Logo.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Logo</h4>
              <h6 className="list_sm_desc">1500 x 1500 px</h6>
            </SwiperSlide>
            {/* <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(321.26, 188.976, "bus")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Business_card.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Business Card</h4>
              <h6 className="list_sm_desc">8.5 x 5 cm</h6>
            </SwiperSlide>*/}
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(1920, 1080, "pre")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Presentation_Card.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Presentation Card</h4>
              <h6 className="list_sm_desc">1920 x 1080 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(800, 800, "soc")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Social_media.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Social Media</h4>
              <h6 className="list_sm_desc">800 x 800 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(1080, 1920, "ins")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Instagram_story.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Instagram Story</h4>
              <h6 className="list_sm_desc">1080 x 1920 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(1280, 720, "you")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Youtube_thumbnail.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Youtube Thumbnail</h4>
              <h6 className="list_sm_desc">1280 x 720 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(940, 788, "fac")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Facebook_post.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Facebook Post</h4>
              <h6 className="list_sm_desc">940 x 788 px</h6>
            </SwiperSlide>
            <SwiperSlide
              className={"canvas_list_item"}
              onClick={() => this.selectSize(2160, 2160, "inp")}
            >
              {" "}
              <img
                className="list_sm_image"
                src="./home-img/Social_media.svg"
                alt="canvas"
              />
              <h4 className="list_sm_title">Instagram Post</h4>
              <h6 className="list_sm_desc">2160 x 2160 px</h6>
            </SwiperSlide>
            {/*<SwiperSlide onClick={() => this.selectSize(800, 2000)}>
              {" "}
              <div className="canvas_list_item swiper-slide">
                <img
                  className="list_sm_image"
                  src="./home-img/poster.svg"
                  alt="canvas"
                />
                <h4 className="list_sm_title">Infographic</h4>
                <h6 className="list_sm_desc">800 x 2000 px</h6>
              </div>
            </SwiperSlide>*/}
          </div>
          <div className="swiper-button-next swiper-button-canvas-next"></div>
          <div className="swiper-button-prev swiper-button-canvas-prev"></div>
        </Swiper>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  const homeData = state.HomeReducer;

  if (homeData) {
    returnState.canvasSize = homeData ? homeData.data : {};
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setCanvasSize: setCanvasSize,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewDesign));
