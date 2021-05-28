import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import SyncLoader from "react-spinners/SyncLoader";
import Masonry from "react-masonry-css";
import HoverVideoPlayer from "react-hover-video-player";
import {
  pexelsVideoList,
  exportEmptyData,
  pexelsVideoSearch,
  pexelVideo,
} from "../../../Actions/sidebarActions.js";
import { addVideo, getVideoElement } from "../Handlers/Handlers.js";

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cg: this.props.match.params ? this.props.match.params.cg : "cus",
      videoData: {},
      videoList: [],
      page: 1,
      canvas: "",
      term: "",
      searchActive: false,
      showLoader: false,
    };
  }

  componentDidMount() {
    let formData = {
      per_page: 20,
      page: this.state.page,
      minDuration: 10,
      maxDuration: 30,
      //query: "popular",
    };
    //this.props.pexelVideo(formData);
    this.setState({ showLoader: true });
    this.props.pexelsVideoList(formData);
  }

  static getDerivedStateFromProps(props, state) {
    props.exportEmptyData();

    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;
    }

    if (props.pexelsVideos !== undefined && state.videoList.length == 0) {
      props.exportEmptyData();

      returnState.videoData = props.pexelsVideos ? props.pexelsVideos : {};
      //console.log(returnState.videoData);
      returnState.videoList = props.pexelsVideos
        ? props.pexelsVideos.videos
        : [];
      returnState.showLoader = false;
    } else if (
      props.pexelsVideos !== undefined &&
      props.pexelsVideos !== state.videoData &&
      state.videoList.length !== 0 &&
      props.pexelsVideosDate !== state.pexelsVideosDate
    ) {
      returnState.pexelsVideosDate = props.pexelsVideosDate;
      returnState.videoList = [
        ...state.videoList,
        ...props.pexelsVideos.videos,
      ];
      returnState.showLoader = false;
    }

    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      if (
        returnState.loadMore.videos == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term == ""
      ) {
        returnState.page = returnState.loadMore.page;

        let formData = {
          page: returnState.page,
          per_page: 20,

          minDuration: 10,
          maxDuration: 30,
          query: "",
        };
        props.pexelsVideoList(formData);
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
          per_page: 20,
          minDuration: 10,
          maxDuration: 30,
        };

        props.pexelsVideoSearch(formData);
      }
    }
    return returnState;
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      [event.target.name]: value,
    });
  };

  addThisVideo = (link) => {
    let canvas = this.state.canvas;
    if (link) {
      getVideoElement(canvas, link);
    }
  };

  handleSearchClose = () => {
    //  this.props.getBackImages();
    let formData = {
      per_page: 20,
      page: this.state.page,
      minDuration: 10,
      maxDuration: 30,
    };
    this.props.pexelsVideoList(formData);
    this.setState({
      term: "",

      page: 1,
      videoList: [],
      videoData: [],
      searchActive: false,
    });
    this.props.exportEmptyData();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let query = this.state.term ? this.state.term.trim() : "";

    if (query === "" || query === undefined || query === null) {
      return;
    }
    if (query && query !== "") {
      let formData = {
        per_page: 20,
        minDuration: 10,
        maxDuration: 30,
        page: 1,
        query: query ? query : "",
      };
      this.props.pexelsVideoSearch(formData);
    } else {
      let formData = {
        per_page: 20,
        page: this.state.page,
        minDuration: 10,
        maxDuration: 30,
      };
      this.props.pexelsVideoList(formData);
    }
    this.setState({
      videoList: [],
      searchActive: true,
      videoData: {},
      showLoader: true,
    });
  };

  render() {
    return (
      <div className="videos-category mt-4">
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
                  placeholder="Search Videos"
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

        <div className={this.state.searchActive ? "row mt-2" : "row mt-4"}>
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Trending</span>
          </div>
          <div className="col-md-12 col-sm-12 mt-2">
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {this.state.videoList &&
                this.state.videoList.length > 0 &&
                this.state.videoList.map((obj, id) => {
                  return (
                    <div key={id} className="myDesignVideos">
                      <span
                        className=""
                        key={id}
                        onClick={() =>
                          this.addThisVideo(
                            obj.video_files
                              ? obj.video_files[2].link
                              : obj.video_files[1]
                              ? obj.video_files[1].link
                              : ""
                          )
                        }
                      >
                        {/*<HoverVideoPlayer
                          videoSrc={
                            obj.video_files ? obj.video_files[2].link : ""
                          }
                          restartOnPaused={true}
                          pausedOverlay={<img src={obj.image} alt="" />}
                          style={{
                            width: "100%",
                            cursor: "pointer",
                            height: "100%",
                          }}
                        />*/}

                        <video
                          key={id}
                          name="displayFor"
                          muted
                          style={{
                            width: "100%",
                            cursor: "pointer",
                            height: "100%",
                            display: "block",
                          }}
                          onMouseOver={(e) => e.target.play()}
                          onMouseOut={(e) => e.target.pause()}
                          src={
                            obj.video_files
                              ? obj.video_files[2].link
                              : obj.video_files[1]
                              ? obj.video_files[1].link
                              : ""
                          }
                        />

                        {/*<img src={obj.image} />*/}
                      </span>
                    </div>
                  );
                })}
            </Masonry>

            {this.state.videoList &&
              this.state.videoList.length == 0 &&
              this.state.term &&
              !this.state.showLoader && (
                <span
                  className={
                    this.state.searchActive ? "error-text" : "noDisplay"
                  }
                >
                  Sorry, we couldn't find any Video for "
                  {" " + this.state.term + " "} " Try searching something
                  related.
                </span>
              )}

            {this.state.videoList &&
              this.state.videoList.length == 0 &&
              this.state.showLoader && (
                <span className={"error-text"}>
                  <SyncLoader
                    size={10}
                    color={"#ffffff"}
                    loading={this.state.showLoader}
                  />
                </span>
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let returnState = {};

  if (state.SidebarReducer.action == "VIDEO_LIST") {
    if (!state.SidebarReducer.data) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.pexelsVideos = state.SidebarReducer.data;
      //console.log(returnState.pexelsVideos);
      returnState.pexelsVideosDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "VIDEO_SEARCH") {
    if (!state.SidebarReducer.data) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.pexelsVideos = state.SidebarReducer.data;
      //console.log(returnState.pexelsVideos);
      returnState.pexelsVideosDate = new Date();
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
      pexelsVideoList: pexelsVideoList,
      pexelsVideoSearch: pexelsVideoSearch,
      exportEmptyData: exportEmptyData,
      pexelVideo: pexelVideo,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Videos));
