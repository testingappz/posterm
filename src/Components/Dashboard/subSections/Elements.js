import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import SyncLoader from "react-spinners/SyncLoader";
import {
  addTriangle,
  addCircle,
  addSquare,
  addLine,
  addSVG2,
  addGif,
  addGiphy,
  addEllipse,
  addPoly,
  addStar1,
  addStar2,
  addStar3,
  addFrame,
  addPolyFrame,
  addCircleFrame,
} from "../Handlers/SVGShapes.js";
import {
  circleMask,
  biliMask,
  heartMask,
  rectMask,
  triangleMask,
  ellipseMask,
  polygonMask,
  star1Mask,
  star2Mask,
} from "../Handlers/Masking.js";

import {
  getSvgs,
  elementSearch,
  getGiphy,
  giphySearch,
  exportEmptyData,
  getShapes,
  getMask,
} from "../../../Actions/sidebarActions.js";
import {
  scrollState,
  getSelectedType,
} from "../../../Actions/canvasActions.js";

class Elements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cg: this.props.match.params ? this.props.match.params.cg : "cus",
      showAll1: false,
      photos: [1, 2, 3, 4, 5, 6, 6],
      svgsData: {},
      canvas: "",
      svgsList: [],
      showSvg: false,
      term: "",
      ghipyList: [],
      giphyFirstTwo: [],
      showGhipy: false,
      key: "",
      page: 0,
      loadMore: {},
      shapesData: {},
      shapesList: [],
      maskData: {},
      maskList: [],
      showMask: false,
      searchActive: false,
      showLoader: false,
    };
  }
  componentDidMount() {
    let stickers = this.props.stickers;
    let firstTwo = this.props.firstTwo;
    this.props.exportEmptyData();
    this.props.getSvgs();
    this.props.getShapes();
    this.props.getMask();

    let formData = {
      page: this.state.page,
    };
    //this.props.getGiphy(formData);
    this.setState({ ghipyList: stickers, giphyFirstTwo: firstTwo });
  }

  showAllElements = () => {
    this.setState({
      showAll1: true,
      showSvg: false,
      showGhipy: false,
      key: "shapes",
      term: "shapes",
    });
  };

  showAllSvgElements = () => {
    this.setState({
      showSvg: !this.state.showSvg,
      showAll1: false,
      showGhipy: false,
      key: "svg",
      term: "Featured",
    });
  };

  showAllMask = () => {
    this.setState({
      showMask: !this.state.showMask,
      showAll1: false,
      showSvg: false,
      showGhipy: false,
      key: "mask",
      term: "Pattern Fills",
    });
  };

  showAllGhipy = () => {
    this.setState({
      showGhipy: true,
      showAll1: false,
      showSvg: false,
      key: "giphy",
      term: "Stickers",
    });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    /*if (event.target.name === "term") {
      let formData = {
        term: value,
      };

      this.props.elementSearch(formData);
    }*/
    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};

    props.exportEmptyData();
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;
    }
    if (props.svgsData !== undefined && props.svgsData !== state.svgsData) {
      returnState.svgsData = props.svgsData;
      returnState.svgsList = props.svgsData ? props.svgsData.data : [];
      returnState.showSvg = false;
    }

    if (
      props.svgsTermData !== undefined &&
      props.svgsTermData !== state.svgsTermData &&
      props.termDate !== state.termDate
    ) {
      returnState.svgsList = props.svgsTermData ? props.svgsTermData.data : [];
      if (props.svgsTermData && returnState.svgsList.length) {
        returnState.showSvg = true;
      } else {
        returnState.showSvg = false;
      }
    }
    if (
      props.ghipyData !== undefined &&
      state.ghipyList &&
      state.ghipyList.length == 0
    ) {
      props.exportEmptyData();
      let firstTwo = [];
      returnState.ghipyList = props.ghipyData;
      returnState.showLoader = false;

      if (returnState.ghipyList.length) {
        returnState.ghipyList.map((obj, id) => {
          if (id < 2) {
            firstTwo.push(obj);
          }
        });
      }
      returnState.giphyFirstTwo = firstTwo;
    }
    if (
      props.ghipyData !== undefined &&
      props.ghipyData !== state.ghipyList &&
      state.ghipyList.length !== 0 &&
      props.giphyListDate !== state.giphyListDate
    ) {
      props.exportEmptyData();
      returnState.showLoader = false;
      returnState.giphyListDate = props.giphyListDate;
      returnState.ghipyList = [...state.ghipyList, ...props.ghipyData];
    }

    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      // console.log(props.loadMore);
      if (
        returnState.loadMore.elements == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        !state.searchActive &&
        (state.term !== "" || state.term == "stickers")
      ) {
        //console.log("inside");
        returnState.page = returnState.loadMore.page;
        let formData = {
          page: returnState.page,
        };
        props.getGiphy(formData);
      }

      if (
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.searchActive &&
        (state.term !== "" || state.term !== "stickers")
      ) {
        returnState.page = returnState.loadMore.page;
        let formData = {
          page: returnState.page,
          term: state.term,
        };

        props.giphySearch(formData);
      }
    }
    if (
      props.shapesData !== undefined &&
      props.shapesData.status == "200" &&
      props.shapesData !== state.shapesData
    ) {
      returnState.shapesData = props.shapesData ? props.shapesData : {};
      returnState.shapesList = props.shapesData ? props.shapesData.data : [];
    }

    if (
      props.maskData !== undefined &&
      props.maskData.status == "200" &&
      props.maskData !== state.maskData
    ) {
      returnState.maskData = props.maskData ? props.maskData : {};
      returnState.maskList = props.maskData ? props.maskData.data : [];
    }
    return returnState;
  }

  addShapes = (value) => {
    let canvas = this.state.canvas;

    if (value === "triangle") {
      addTriangle(canvas);
    }
    if (value === "circle") {
      addCircle(canvas);
    }
    if (value === "square") {
      addSquare(canvas);
    }
    if (value == "line") {
      addLine(canvas);
    }
    if (value === "ellipse") {
      addEllipse(canvas);
    }
    if (value == "poly1") {
      addPoly(canvas);
    }
    if (value == "star1") {
      addStar1(canvas);
    }
    if (value == "star2") {
      addStar2(canvas);
    }
    if (value == "star3") {
      addStar3(canvas);
    }
    if (value == "sFrame") {
      addFrame(canvas);
    }
    if (value == "polyFrame") {
      addPolyFrame(canvas);
    }
    if (value == "circleFrame") {
      addCircleFrame(canvas);
    }
    this.props.getSelectedType(value);
  };

  addMask = (value) => {
    let category = this.state.cg;
    console.log("cat", category);
    let canvas = this.state.canvas;
    if (value === "triangle") {
      triangleMask(canvas, category);
    }
    if (value === "circle") {
      circleMask(canvas, category);
    }
    if (value === "rect") {
      rectMask(canvas, category);
    }
    if (value == "line") {
      addLine(canvas);
    }
    if (value === "ellipse") {
      ellipseMask(canvas, category);
    }
    if (value == "polygon") {
      polygonMask(canvas, category);
    }
    if (value == "heart") {
      heartMask(canvas, category);
    }
    if (value == "star1") {
      star1Mask(canvas, category);
    }
    if (value == "star2") {
      star2Mask(canvas, category);
    }
    if (value == "star3") {
      addStar3(canvas);
    }
    if (value == "sFrame") {
      addFrame(canvas);
    }
    if (value == "bili") {
      biliMask(canvas);
    }
    if (value == "circleFrame") {
      addCircleFrame(canvas);
    }
    //this.props.getSelectedType(value);
  };

  handleSearchClose = () => {
    this.setState({
      term: "",
      key: "",
      showGhipy: false,
      showAll1: false,
      showSvg: false,
      searchActive: false,
      showMask: false,
      ghipyList: this.props.stickers,
    });
    let formData = {
      page: 0,
    };
    this.props.getGiphy(formData);
    this.props.getSvgs();
    //this.props.getShapes();
  };

  addGroupSVG = (canvas, url) => {
    addSVG2(canvas, url);
    this.props.getSelectedType("group");
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("search ");
    this.props.exportEmptyData();
    if (this.state.term) {
      let formData = {
        term: this.state.term,
        page: 0,
      };
      this.setState({
        //shapesList: [],
        searchActive: true,
        showAll1: false,
        showSvg: false,
        ghipyList: [],
        showGhipy: false,
        showMask: false,
        showLoader: true,
      });
      this.props.giphySearch(formData);

      //this.props.elementSearch(formData);
    } else {
      this.props.exportEmptyData();
      let formData = {
        page: 0,
      };
      this.props.getGiphy(formData);
      this.props.getSvgs();
      this.props.getShapes();
      this.setState({
        shapesList: [],
        searchActive: false,
        showAll1: false,
        ghipyList: [],
        maskList: [],
        showGhipy: false,
        showMask: false,
        showLoader: true,
      });
    }
  };

  addStickers = (url, width, height) => {
    let canvas = this.state.canvas;
    addGiphy(canvas, url, width, height);
    this.props.getSelectedType("giphy");
  };

  render() {
    let canvas = this.state.canvas;
    //console.log("showAll", this.state.showAll1);
    //console.log("showGhipy", this.state.showGhipy);
    //console.log("showSvg", this.state.showSvg);
    //console.log(this.state.ghipyList);
    return (
      <div className="elemensts-category mt-4">
        <div className="row search-box">
          <div className="col-md-12 col-sm-12">
            <form onSubmit={this.handleSubmit}>
              <div className="input-group rounded-pill p-1">
                <div className="input-group-prepend border-0">
                  <button
                    id="button-addon4"
                    type="button"
                    className="btn btn-link text-info"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                <input
                  value={this.state.term}
                  type="text"
                  placeholder="Search Stickers"
                  aria-describedby="button-addon4"
                  className="form-control bg-none border-0"
                  onChange={this.handleInputChange}
                  name="term"
                  autoComplete="off"
                />

                {this.state.term && (
                  <button
                    type="button"
                    className="close search-close"
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div
          className={
            this.state.showGhipy || this.state.showAll1 || this.state.showMask
              ? "noDisplay"
              : ""
          }
        >
          <div className={this.state.searchActive ? "row mt-2" : "row mt-4"}>
            {!this.state.searchActive && (
              <div className="col-md-12 col-sm-12">
                <span className="poster-heading">Featured</span>
                <a
                  className={!this.state.showSvg ? "see-all" : "noDisplay"}
                  onClick={this.showAllSvgElements}
                >
                  See all
                </a>
              </div>
            )}
            <div className="col-md-12 col-sm-12 mt-2">
              <ul className="category-section ">
                {!this.state.showSvg && !this.state.searchActive && (
                  <li onClick={() => this.addGroupSVG(canvas, "/img/1.svg")}>
                    <span className="img-section">
                      <img src="/img/1.svg" />
                    </span>
                  </li>
                )}
                {!this.state.showSvg && !this.state.searchActive && (
                  <li onClick={() => this.addGroupSVG(canvas, "/img/2.svg")}>
                    <span className="img-section">
                      <img src="/img/2.svg" />
                    </span>
                  </li>
                )}

                {this.state.showSvg &&
                  this.state.svgsList &&
                  this.state.svgsList.length &&
                  this.state.svgsList.map((obj, id) => {
                    return (
                      <li
                        className="mb-3"
                        onClick={() => this.addGroupSVG(canvas, obj.image_url)}
                      >
                        <span className="img-section">
                          <img src={obj.image_url} />
                        </span>
                      </li>
                    );
                  })}
                {this.state.ghipyList &&
                  this.state.ghipyList.length == 0 &&
                  !this.state.showLoader && (
                    <li
                      className={
                        this.state.showAll1 ||
                        this.state.showSvg ||
                        this.state.term
                          ? "mb-2 width-100-li"
                          : "noDisplay"
                      }
                    >
                      <span>
                        Sorry, we couldn't find any sticker for "
                        {" " + this.state.term + " "} " Try searching something
                        related.
                      </span>
                    </li>
                  )}

                {this.state.ghipyList &&
                  this.state.ghipyList.length == 0 &&
                  this.state.showLoader && (
                    <li
                      className={
                        this.state.showAll1 ||
                        this.state.showSvg ||
                        this.state.term
                          ? "mb-2 width-100-li"
                          : "noDisplay"
                      }
                    >
                      <span>
                        <SyncLoader
                          size={10}
                          color={"#ffffff"}
                          loading={this.state.showLoader}
                        />
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </div>
        {
          <div
            className={
              this.state.showGhipy ||
              this.state.showSvg ||
              this.state.showMask ||
              this.state.searchActive
                ? "noDisplay"
                : "row mt-4"
            }
          >
            {!this.state.searchActive && (
              <div className="col-md-12 col-sm-12">
                <span className="poster-heading">Shapes</span>
                <a
                  className={!this.state.showAll1 ? "see-all" : "noDisplay"}
                  onClick={this.showAllElements}
                >
                  See all
                </a>
              </div>
            )}
            <div className="col-md-12 col-sm-12 mt-2 mb-4">
              <ul className="category-section elements-svg">
                {!this.state.showAll1 && !this.state.searchActive && (
                  <li onClick={() => this.addShapes("circle")}>
                    <span className="img-section">
                      <img src="/img/scircle.webp" />
                    </span>
                  </li>
                )}
                {!this.state.showAll1 && !this.state.searchActive && (
                  <li onClick={() => this.addShapes("square")}>
                    <span className="img-section">
                      <img src="/img/ssquare.webp" />
                    </span>
                  </li>
                )}
                {this.state.showAll1 &&
                  this.state.shapesData &&
                  this.state.shapesList.map((obj, id) => {
                    return (
                      <li
                        onClick={(name) => this.addShapes(obj.name)}
                        key={id}
                        className="mt-4"
                      >
                        <span className="img-section">
                          <img src={"/" + obj.image} />
                        </span>
                      </li>
                    );
                  })}
                {/*{this.state.showAll1 && (
                  <li className="mb-3" onClick={() => this.addShapes(2)}>
                    <span className="img-section">
                      <img src="img/ssquare.webp" />
                    </span>
                  </li>
                )}
                {this.state.showAll1 && (
                  <li className="mb-3" onClick={() => this.addShapes(3)}>
                    <span className="img-section">
                      <img src="img/striangle.webp" />
                    </span>
                  </li>
                )}
                {this.state.showAll1 && (
                  <li className="mb-3" onClick={() => this.addShapes(4)}>
                    <span className="img-section">
                      <img src="img/line.png" />
                    </span>
                  </li>
                )}*/}
              </ul>
            </div>
          </div>
        }
        {/*GIF Images Ghipy Start*/}
        {
          <div
            className={
              this.state.showSvg ||
              this.state.showAll1 ||
              this.state.showMask ||
              this.state.searchActive
                ? "noDisplay"
                : ""
            }
          >
            <div className={!this.state.searchActive ? "row mt-5" : "row mt-2"}>
              {!this.state.searchActive && !this.state.showGhipy && (
                <div className="col-md-12 col-sm-12">
                  <span className="poster-heading">Stickers</span>
                  <a className="see-all" onClick={this.showAllGhipy}>
                    See all
                  </a>
                </div>
              )}
              <div className="col-md-12 col-sm-12 mt-2">
                <ul className="category-section">
                  {!this.state.showGhipy &&
                    !this.state.searchActive &&
                    this.state.giphyFirstTwo.map((obj, id) => {
                      return (
                        <li
                          onClick={() =>
                            this.addStickers(
                              obj.images.downsized_medium.webp
                                ? obj.images.downsized_medium.webp
                                : obj.images.downsized_medium.url
                                ? obj.images.downsized_medium.url
                                : "",
                              obj.images.downsized_medium.width,
                              obj.images.downsized_medium.height

                              /*obj.images.fixed_height.webp
                                ? obj.images.fixed_height.webp
                                : obj.images.fixed_height.url
                                ? obj.images.fixed_height.url
                                : "",
                              obj.images.fixed_height.width,
                              obj.images.fixed_height.height*/
                            )
                          }
                          key={id}
                        >
                          <span className="img-section ghipy">
                            <img src={obj.images.fixed_width_still.url} />
                          </span>
                        </li>
                      );
                    })}

                  {this.state.showGhipy &&
                    this.state.ghipyList &&
                    this.state.ghipyList.length &&
                    this.state.ghipyList.map((obj, id) => {
                      return (
                        <li
                          className="mb-3"
                          key={id}
                          onClick={() =>
                            this.addStickers(
                              obj.images.downsized_medium.webp
                                ? obj.images.downsized_medium.webp
                                : obj.images.downsized_medium.url
                                ? obj.images.downsized_medium.url
                                : "",
                              obj.images.downsized_medium.width,
                              obj.images.downsized_medium.height
                            )
                          }
                        >
                          <span className="img-section ghipy">
                            <img src={obj.images.fixed_width_still.url} />
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        }
        {this.state.searchActive && (
          <div className={!this.state.searchActive ? "noDisplay" : ""}>
            <div className={!this.state.searchActive ? "row mt-5" : "row mt-2"}>
              <div className="col-md-12 col-sm-12 mt-2">
                <ul className="category-section">
                  {this.state.ghipyList &&
                    this.state.ghipyList.length &&
                    this.state.ghipyList.map((obj, id) => {
                      return (
                        <li
                          className="mb-3"
                          key={id}
                          onClick={() =>
                            this.addStickers(
                              obj.images.downsized_medium.webp
                                ? obj.images.downsized_medium.webp
                                : obj.images.downsized_medium.url
                                ? obj.images.downsized_medium.url
                                : "",
                              obj.images.downsized_medium.width,
                              obj.images.downsized_medium.height
                            )
                          }
                        >
                          <span className="img-section ghipy">
                            <img src={obj.images.fixed_width_still.url} />
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/*
          <div
            className={
              this.state.showSvg ||
              this.state.showAll1 ||
              this.state.showGhipy ||
              this.state.searchActive
                ? "noDisplay"
                : ""
            }
          >
            <div className={!this.state.showMask ? "row mt-5" : "row mt-2"}>
              {!this.state.searchActive && !this.state.showMask && (
                <div className="col-md-12 col-sm-12">
                  <span className="poster-heading">Pattern Fills</span>
                  <a
                    className={!this.state.showMask ? "see-all" : "noDisplay"}
                    onClick={this.showAllMask}
                  >
                    See all
                  </a>
                </div>
              )}

              <div className="col-md-12 col-sm-12 mt-2 mb-4">
                <ul className="category-section elements-svg">
                  {!this.state.showMask && (
                    <li onClick={() => this.addMask("circle")}>
                      <span className="img-section filter-box">
                        <img src="/img/circlemask.png" />
                      </span>
                    </li>
                  )}
                  {!this.state.showMask && (
                    <li onClick={() => this.addMask("rect")}>
                      <span className="img-section filter-box">
                        <img src="/img/ssquare.webp" />
                      </span>
                    </li>
                  )}

                  {this.state.showMask &&
                    this.state.maskData &&
                    this.state.maskList.map((obj, id) => {
                      return (
                        <li
                          onClick={(name) => this.addMask(obj.name)}
                          key={id}
                          className="mt-4"
                        >
                          <span className="img-section filter-box">
                            <img src={obj.image} />
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        */}

        {/* <div className="row mt-5">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Earth's Day Card</span>
            <a href="#" className="see-all">
              See all
            </a>
          </div>
          <div className="col-md-12 col-sm-12 mt-2">
            <ul className="category-section">
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Birthday Card</span>
            <a href="#" className="see-all">
              See all
            </a>
          </div>
          <div className="col-md-12 col-sm-12 mt-2">
            <ul className="category-section">
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Thankyou Card</span>
            <a href="#" className="see-all">
              See all
            </a>
          </div>
          <div className="col-md-12 col-sm-12 mt-2">
            <ul className="category-section">
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Father's Day Card</span>
            <a href="#" className="see-all">
              See all
            </a>
          </div>
          <div className="col-md-12 col-sm-12 mt-2">
            <ul className="category-section">
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
              <li>
                <span className="img-section">
                  <img src="img/1.png" />
                </span>
              </li>
            </ul>
          </div>
        </div>*/}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  const data = state.CanvasReducer;

  if (data) {
    returnState.canvas = data ? data.canvasData : {};
    returnState.loadMore = data ? data.scrollData : {};
    //console.log(returnState.loadMore);
  }

  if (state.SidebarReducer.action == "GET_SVG_IMAGES") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.svgsData = state.SidebarReducer.data;
    }
  }

  if (state.SidebarReducer.action == "GET_SHAPES") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;

      returnState.errorDate = new Date();
    } else {
      returnState.shapesData = state.SidebarReducer.data;
    }
  }

  if (state.SidebarReducer.action == "GET_MASK") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.maskData = state.SidebarReducer.data;
    }
  }

  if (state.SidebarReducer.action == "GET_GIPHY_IMAGES") {
    if (state.SidebarReducer.data.meta.status !== 200) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.ghipyData = state.SidebarReducer.data.data;
      returnState.giphyListDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_GIPHY_IMAGES") {
    if (state.SidebarReducer.data.meta.status !== 200) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.ghipyData = state.SidebarReducer.data.data;
      returnState.giphyListDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_ELEMENTS") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.svgsTermData = state.SidebarReducer.data;
      returnState.termDate = new Date();
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSvgs: getSvgs,
      elementSearch: elementSearch,
      getGiphy: getGiphy,
      scrollState: scrollState,
      getShapes: getShapes,
      giphySearch: giphySearch,
      exportEmptyData: exportEmptyData,
      getSelectedType: getSelectedType,
      getMask: getMask,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Elements));
