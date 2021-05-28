import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { addImage } from "../Handlers/Handlers.js";
import Masonry from "react-masonry-css";
import {
  maskImage,
  ImageFit,
  circleMask,
  biliMask,
} from "../Handlers/Masking.js";
import SyncLoader from "react-spinners/SyncLoader";
import {
  getBackImages,
  photosSearch,
  getUnsplashImages,
  unsplashPhotosSearch,
  exportEmptyData,
} from "../../../Actions/sidebarActions.js";
import {
  scrollState,
  getSelectedType,
  toolsMenu,
} from "../../../Actions/canvasActions.js";
class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cg: this.props.match.params ? this.props.match.params.cg : "cus",
      showAll2: false,
      photos: [1, 2, 3, 4, 5, 6, 6],
      searchPhotos: "",
      canvas: "",
      photosData: [],
      term: "",
      unsplashImages: [],
      unsplashFirstTwo: [],
      key: "",
      loadMore: {},
      page: 1,
      searchActive: false,
      loading: false,
      errormsg: "",
    };
  }

  componentDidMount() {
    //this.props.exportEmptyData();
    this.setState({ loading: true });
    let formData = {
      page: this.state.page,
      query: this.state.term ? this.state.term : "random",
    };
    this.props.getBackImages(formData);
    // this.props.getUnsplashImages(formData);
  }

  showAllPhotos = (key) => {
    if (key == "un") {
      this.setState({
        showAll2: !this.state.showAll2,
        term: "Unsplash",
      });
    }
    this.setState({
      showAll2: !this.state.showAll2,
      searchPhotos: "Recently Used",
    });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    /*if (event.target.name === "term") {
      this.setState({ unsplashImages: [] });
      this.props.exportEmptyData();
      if (value.length == 0) {
        let formData = {
          page: 1,
        };
        this.props.getUnsplashImages(formData);
      }
      if (value.length > 3) {
        let formData = {
          page: 1,
          query: value,
        };
        this.props.unsplashPhotosSearch(formData);
      }

      // this.props.photosSearch(formData);
    }*/
    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    // console.log(props);
    props.exportEmptyData();

    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;
    }

    if (props.photosData !== undefined && state.photosData.length == 0) {
      props.exportEmptyData();
      //console.log(props.photosData);
      returnState.photosData = props.photosData ? props.photosData.data : [];
      returnState.loading = false;
    } else if (
      props.photosData !== undefined &&
      props.unsplashImages !== state.photosData &&
      state.photosData.length !== 0 &&
      props.photosDataDate !== state.photosDataDate
    ) {
      returnState.photosDataDate = props.photosDataDate;
      returnState.photosData = [...state.photosData, ...props.photosData.data];
    }

    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      if (
        returnState.loadMore.photos == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term == ""
      ) {
        returnState.page = returnState.loadMore.page;

        let formData = {
          page: returnState.page,
          query: "random",
        };
        props.getBackImages(formData);
        //props.getUnsplashImages(formData);
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

        props.getBackImages(formData);
      }
    }
    return returnState;
  }

  handleSearchClose = () => {
    //  this.props.getBackImages();
    let formData = {
      page: 1,
      query: "random",
    };
    this.props.getBackImages(formData);
    this.setState({
      term: "",
      showAll2: false,
      page: 1,
      unsplashImages: [],
      photosData: [],
      searchActive: false,
      errormsg: "",
      loading: true,
    });
    this.props.exportEmptyData();
  };

  showImage = (canvas, url) => {
    let category = this.state.cg;
    addImage(canvas, url, category);

    this.props.getSelectedType("");
    this.props.getSelectedType("image");
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.term) {
      let formData = {
        page: 1,
        query: this.state.term,
      };
      this.setState({
        errormsg: this.state.term,
        searchActive: true,
      });
      this.props.getBackImages(formData);
    } else {
      let formData = {
        page: 1,
        query: "random",
      };
      this.setState({
        errormsg: "",
        searchActive: false,
      });
      this.props.getBackImages(formData);
    }
    this.setState({
      unsplashImages: [],

      photosData: [],
      loading: true,
    });
  };

  render() {
    let canvas = this.state.canvas;

    return (
      <div className="photos-category mt-4">
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
                  placeholder="Search Photos"
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

        {this.state.photosData && (
          <div className={this.state.searchActive ? "row mt-2" : "row mt-4"}>
            {
              <div className="col-md-12 col-sm-12">
                <span className="poster-heading">
                  {" "}
                  {this.state.searchActive ? "" : "Trending"}
                </span>
              </div>
            }
            <div className="col-md-12 col-sm-12 mt-2">
              <Masonry
                breakpointCols={2}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {this.state.photosData &&
                  this.state.photosData.length > 0 &&
                  this.state.photosData.map((obj, id) => {
                    return (
                      <div
                        key={id}
                        className="myDesignVideos"
                        id="images"
                        style={{ cursor: "pointer" }}
                        onClick={() => addImage(canvas, obj.image_url)}
                      >
                        <span>
                          <img src={obj.image_url} draggable="true" />
                        </span>
                      </div>
                    );
                  })}
              </Masonry>
              {this.state.photosData &&
                this.state.photosData.length == 0 &&
                this.state.searchActive &&
                !this.state.loading && (
                  <span
                    className={
                      this.state.searchActive ? "error-text" : "noDisplay"
                    }
                  >
                    Sorry, we couldn't find any photos for "
                    {" " + this.state.errormsg + " "} " Try searching something
                    related.
                  </span>
                )}

              {this.state.photosData &&
                this.state.photosData.length == 0 &&
                this.state.loading && (
                  <span
                    className={this.state.loading ? "error-text" : "noDisplay"}
                  >
                    <SyncLoader
                      size={10}
                      color={"#ffffff"}
                      loading={this.state.loading}
                    />
                  </span>
                )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};
  //console.log(state);
  if (state.SidebarReducer.action == "GET_BACK_IMAGES") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      returnState.photosData = state.SidebarReducer.data;
      returnState.photosDataDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "GET_UNSPLASH_IMAGES") {
    if (state.SidebarReducer.data && state.SidebarReducer.data.length <= 0) {
      //console.log(state.SidebarReducer.data);
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.unsplashImages = state.SidebarReducer.data;
      returnState.unsplashImagesDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_UNSPLASH_PHOTOS") {
    if (state.SidebarReducer.data && state.SidebarReducer.data.length <= 0) {
      //console.log(state.SidebarReducer.data);
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      //returnState.photosData = state.SidebarReducer.data.data;
      returnState.unsplashImages = state.SidebarReducer.data.results;
      //console.log(state.SidebarReducer.data);
      returnState.unsplashImagesDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_PHOTOS") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      returnState.photosData = state.SidebarReducer.data.data;
    }
  }

  if (state.CanvasReducer !== undefined) {
    const data = state.CanvasReducer;
    returnState.canvas = state.CanvasReducer.canvasData;
    returnState.loadMore = data ? data.scrollData : {};
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getBackImages: getBackImages,
      photosSearch: photosSearch,
      getUnsplashImages: getUnsplashImages,
      unsplashPhotosSearch: unsplashPhotosSearch,
      scrollState: scrollState,
      exportEmptyData: exportEmptyData,
      getSelectedType: getSelectedType,
      toolsMenu: toolsMenu,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Photos));
