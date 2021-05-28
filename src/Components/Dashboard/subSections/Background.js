import React, { Component } from "react";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Masonry from "react-masonry-css";
import {
  getBackground,
  backgroundSearch,
  unsplashBackgroundSearch,
  exportEmptyData,
} from "../../../Actions/sidebarActions.js";
import SyncLoader from "react-spinners/SyncLoader";
import {
  getCanvas,
  toolsMenu,
  showAdjustments,
  showFilters,
  sideBar2,
  getSelectedType,
  backgroundState,
} from "../../../Actions/canvasActions.js";
class Background extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background: "",
      showColor: false,
      showColorModal: false,
      backgroundImages: [],
      canvas: "",
      term: "",
      unsplashBackground: {},
      unsplashBackgroundList: [],
      page: 1,
      showLoader: false,
      loadMore: {},
      searchActive: false,
      errormsg: "",
    };
  }
  componentDidMount() {
    let formData = {
      page: 1,
      query: "background",
    };
    this.setState({ showLoader: true });
    ///this.props.unsplashBackgroundSearch(formData);
    this.props.getBackground(formData);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    /*if (event.target.name === "term") {
      this.setState({ unsplashBackgroundList: [] });
      this.props.exportEmptyData();
      if (value.length == 0) {
        let formData = {
          page: 1,
          query: "background",
        };
        this.props.unsplashBackgroundSearch(formData);
      }

      if (value.length > 2) {
        let formData = {
          page: 1,
          query: value,
        };

        this.props.unsplashBackgroundSearch(formData);
      }
    }*/
    // this.props.photosSearch(formData);

    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;
    }

    if (
      props.backgroundImages !== undefined &&
      state.backgroundImages &&
      state.backgroundImages.length == 0
    ) {
      //console.log(props.backgroundImages);
      returnState.backgroundImages = props.backgroundImages
        ? props.backgroundImages
        : [];
      returnState.showLoader = false;
    }

    if (
      props.backgroundImages !== undefined &&
      props.backgroundImages !== state.backgroundImages &&
      state.backgroundImages.length !== 0 &&
      props.backgroundImagesDate !== state.backgroundImagesDate
    ) {
      props.exportEmptyData();
      //console.log("inside2");
      returnState.showLoader = false;
      returnState.backgroundImagesDate = props.backgroundImagesDate;
      if (props.backgroundImages) {
        returnState.backgroundImages = [
          ...state.backgroundImages,
          ...props.backgroundImages,
        ];
      }
    }

    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      if (
        returnState.loadMore.background == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term == ""
      ) {
        // console.log("inside4")
        returnState.page = returnState.loadMore.page;
        let formData = {
          page: returnState.page,
          query: "background",
        };
        props.getBackground(formData);
      }

      if (
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term
      ) {
        returnState.page = returnState.loadMore.page;
        let formData = {
          page: returnState.page,
          query: state.term,
        };

        props.getBackground(formData);
      }
    }
    if (props.bgModal !== undefined && props.bgModal !== state.bgModal) {
      returnState.showColorModal = props.bgModal;
    }

    return returnState;
  }

  handleColorPalette = () => {
    this.setState({ showColor: true });
  };

  handleColorModal = () => {
    this.setState({
      showColorModal: !this.state.showColorModal,
      showColor: false,
    });

    this.props.backgroundState(!this.state.showColorModal);
  };

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
    this.props.changeBackgroundColor(color.hex);
  };

  handleSearchClose = () => {
    // this.props.getBackground();
    this.setState({
      term: "",
      page: 1,
      unsplashBackgroundList: [],
      backgroundImages: [],
      searchActive: false,
      errormsg: "",
      showLoader: true,
    });
    let formData = {
      page: 1,
      query: "background",
    };

    this.props.exportEmptyData();
    //this.props.unsplashBackgroundSearch(formData);
    this.props.getBackground(formData);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.exportEmptyData();
    if (this.state.term) {
      let formData = {
        page: 1,
        query: this.state.term,
      };
      this.setState({
        searchActive: true,
        errormsg: this.state.term,
      });
      this.props.getBackground(formData);

      // this.props.unsplashBackgroundSearch(formData);
    } else {
      let formData = {
        page: 1,
        query: "background",
      };

      this.setState({
        searchActive: false,
        errormsg: "",
      });
      this.props.getBackground(formData);
      //this.props.unsplashBackgroundSearch(formData);
    }

    this.setState({
      unsplashBackgroundList: [],
      backgroundImages: [],
      showLoader: true,
    });
  };
  render() {
    return (
      <div>
        {this.state.showColorModal && (
          <div class="overlay-sidebar" onClick={this.handleColorModal}></div>
        )}
        <div className="background-category mt-4">
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
                    placeholder="Search Background"
                    aria-describedby="button-addon4"
                    className="form-control bg-none border-0"
                    onChange={this.handleInputChange}
                    name="term"
                    autoComplete="off"
                  />

                  {this.state.searchActive && (
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
          <div className="row mt-4">
            <div className="col-md-12 col-sm-12">
              <ul className="palette">
                <li className="palette-box">
                  <img src="/img/palette.png" onClick={this.handleColorModal} />
                  {this.state.showColorModal && (
                    <ul className="print-dropdown palette-dropdown">
                      <li>
                        <h5>New color</h5>
                        <img
                          className="new-color"
                          src="/img/colorwheel.webp"
                          onClick={this.handleColorPalette}
                        />
                        {this.state.showColor && (
                          <ChromePicker
                            color={this.state.background}
                            onChangeComplete={this.handleChangeComplete}
                          />
                        )}
                      </li>
                      <li>
                        <h5>Documents colors</h5>
                        <ul className="document-color">
                          <li
                            style={{
                              background: this.props.backgroundColor,
                            }}
                          ></li>
                        </ul>
                      </li>
                      <li>
                        <h5>Default colors</h5>
                        <ul className="document-color">
                          <li
                            style={{ background: "#6c7093" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#6c7093")
                            }
                          ></li>
                          <li
                            style={{ background: "#99b34d" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#99b34d")
                            }
                          ></li>
                          <li
                            style={{ background: "#b35ba0" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("	#b35ba0")
                            }
                          ></li>
                          <li
                            style={{ background: "#1b1452" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#1b1452")
                            }
                          ></li>
                          <li
                            style={{ background: "#d6ffe8" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#d6ffe8")
                            }
                          ></li>
                          <li
                            style={{ background: "#fb4204" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#fb4204")
                            }
                          ></li>
                        </ul>
                        <ul className="document-color">
                          <li
                            style={{ background: "#293233" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#293233")
                            }
                          ></li>
                          <li
                            style={{ background: "#1ca69d" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#1ca69d")
                            }
                          ></li>
                          <li
                            style={{ background: "#c13e72" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#c13e72")
                            }
                          ></li>
                          <li
                            style={{ background: "#44adbb" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#44adbb")
                            }
                          ></li>
                          <li
                            style={{ background: "#f9ccaa" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#f9ccaa")
                            }
                          ></li>
                          <li
                            style={{ background: "#4b072c" }}
                            onClick={() =>
                              this.props.changeBackgroundColor("#4b072c")
                            }
                          ></li>
                        </ul>
                      </li>
                    </ul>
                  )}
                </li>
                <li
                  style={{ background: "#ffffff" }}
                  onClick={() => this.props.changeBackgroundColor("#ffffff")}
                ></li>
                <li
                  style={{ background: "#7c677f" }}
                  onClick={() => this.props.changeBackgroundColor("#7c677f")}
                ></li>
                <li
                  style={{ background: "#39a0ca" }}
                  onClick={() => this.props.changeBackgroundColor("#39a0ca")}
                ></li>
                <li
                  style={{ background: "#ff414e" }}
                  onClick={() => this.props.changeBackgroundColor("#ff414e")}
                ></li>
                <li
                  style={{ background: "#007f4f" }}
                  onClick={() => this.props.changeBackgroundColor("#007f4f")}
                ></li>
                <li
                  style={{ background: "#d9d9d9" }}
                  onClick={() => this.props.changeBackgroundColor("#d9d9d9")}
                ></li>
              </ul>
            </div>
          </div>

          {this.state.backgroundImages && (
            <div
              className={
                this.state.backgroundImages &&
                this.state.backgroundImages.length !== 0
                  ? "row mt-4"
                  : "row mt-2"
              }
            >
              <div className="col-md-12 col-sm-12 mt-2">
                <Masonry
                  breakpointCols={2}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {this.state.backgroundImages &&
                    this.state.backgroundImages &&
                    this.state.backgroundImages.length &&
                    this.state.backgroundImages.map((obj, id) => {
                      return (
                        <div
                          key={id}
                          className="myDesignVideos"
                          id="images"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            this.props.changeBackgroundImg(
                              obj.bg_url ? obj.bg_url : ""
                            );
                          }}
                        >
                          <span>
                            <img src={obj.bg_url} draggable="true" />
                          </span>
                        </div>
                      );
                    })}
                </Masonry>
                {this.state.backgroundImages &&
                  this.state.backgroundImages &&
                  this.state.backgroundImages.length == 0 &&
                  this.state.searchActive &&
                  !this.state.showLoader && (
                    <span
                      className={
                        this.state.searchActive ? "error-text" : "noDisplay"
                      }
                      style={{ color: "#ffffff" }}
                    >
                      Sorry, we couldn't find any background for "
                      {" " + this.state.errormsg + " "} " Try searching
                      something related.
                    </span>
                  )}
                {this.state.backgroundImages &&
                  this.state.backgroundImages &&
                  this.state.backgroundImages.length == 0 &&
                  this.state.showLoader && (
                    <span className="mb-2  error-text">
                      <SyncLoader
                        size={10}
                        color={"#ffffff"}
                        loading={this.state.showLoader}
                      />
                    </span>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  if (state.SidebarReducer.action == "GET_BACKGROUND_IMAGES") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.backgroundImages = state.SidebarReducer.data.data;
      returnState.backgroundImagesDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_BACKGROUND") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.backgroundImages = state.SidebarReducer.data.data;
    }
  }

  if (state.SidebarReducer.action == "SEARCH_UNSPLASH_BACKGROUND") {
    if (state.SidebarReducer.data && state.SidebarReducer.data.length <= 0) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.unsplashBackground = state.SidebarReducer.data;
      returnState.unsplashBackgroundDate = new Date();
      returnState.apiChanges = true;
    }
  }

  if (state.CanvasReducer !== undefined) {
    const data = state.CanvasReducer;
    returnState.canvas = state.CanvasReducer.canvasData;
    returnState.loadMore = data ? data.scrollData : {};
    returnState.bgModal = data ? data.bgModal : false;
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getBackground: getBackground,
      backgroundSearch: backgroundSearch,
      unsplashBackgroundSearch: unsplashBackgroundSearch,
      exportEmptyData: exportEmptyData,
      getSelectedType: getSelectedType,
      backgroundState: backgroundState,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Background));
