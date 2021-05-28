import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";

import {
  getGiphy,
  giphySearch,
  exportEmptyData,
} from "../../../Actions/sidebarActions.js";
import { addGif, addGiphy } from "../Handlers/SVGShapes.js";
import {
  scrollState,
  getSelectedType,
} from "../../../Actions/canvasActions.js";
class GiphySection extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      page: 0,
      ghipyList: this.props.list,
      showGhipy: false,
      searchActive: false,
    };
    //console.log(this.props);
  }

  componentDidMount() {
    this.props.exportEmptyData();
    let formData = {
      page: this.state.page,
    };
    if (this.state.ghipyList && this.state.ghipyList.length <= 0) {
      // console.log("1");
      // this.props.getGiphy(formData);
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    /*if (event.target.name === "term") {
      this.setState({ ghipyList: [] });
      this.props.exportEmptyData();
      if (value.length == 0) {
        let formData = {
          page: this.state.page,
        };
        this.props.getGiphy(formData);
      }
      if (value.length >= 2) {
        let formData = {  
          term: value,
          page: 0,
        };
        this.props.giphySearch(formData);
      }
    }*/
    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    props.exportEmptyData();
    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;
    }
    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      if (
        returnState.loadMore.giphy == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term == ""
      ) {
        returnState.page = returnState.loadMore.page;
        let formData = {
          page: returnState.page,
        };
        props.getGiphy(formData);
      }

      if (
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term
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
      props.ghipyData !== undefined &&
      state.ghipyList &&
      state.ghipyList.length == 0
    ) {
      returnState.ghipyList = props.ghipyData;
    } else if (
      props.ghipyData !== undefined &&
      props.ghipyData !== state.ghipyList &&
      state.ghipyList.length !== 0 &&
      props.giphyListDate !== state.giphyListDate
    ) {
      returnState.giphyListDate = props.giphyListDate;
      returnState.ghipyList = [...state.ghipyList, ...props.ghipyData];
    }

    return returnState;
  }

  handleSearchClose = () => {
    this.setState({
      term: "",
      key: "",
      ghipyList: [],
      searchActive: false,
    });

    let formData = {
      page: 0,
    };
    this.props.getGiphy(formData);
  };

  addGiphyOnCanvas = (canvas, image, width, height) => {
    addGiphy(canvas, image, width, height);
    this.props.getSelectedType("giphy");
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.exportEmptyData();
    if (this.state.term) {
      let formData = {
        term: this.state.term,
        page: 0,
      };
      this.props.giphySearch(formData);
    } else {
      let formData = {
        page: this.state.page,
      };
      this.props.getGiphy(formData);
    }
    this.setState({ ghipyList: [], searchActive: true });
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
        {
          <div className={!this.state.searchActive ? "row mt-4" : "row mt-2"}>
            <div className="col-md-12 col-sm-12">
              <span className="poster-heading">
                {this.state.searchActive ? "" : "Trending"}
              </span>
            </div>
            <div className="col-md-12 col-sm-12 mt-2">
              <ul className="category-section stickers">
                {/*!this.state.showAll2 &&
                  this.state.unsplashFirstTwo.map((obj, id) => {
                    return (
                      <li
                        key={id}
                        onClick={() => addImage(canvas, obj.urls.regular)}
                      >
                        <span className="img-section">
                          <img src={obj.urls.thumb} />
                        </span>
                      </li>
                    );
                  })*/}

                {!this.state.showGhipy &&
                  this.state.ghipyList &&
                  this.state.ghipyList.length &&
                  this.state.ghipyList.map((obj, id) => {
                    return (
                      <li
                        className="mb-3"
                        onClick={() =>
                          this.addGiphyOnCanvas(
                            canvas,
                            obj.images.fixed_width.webp,
                            obj.images.fixed_width.width,
                            obj.images.fixed_width.height
                          )
                        }
                        key={id}
                      >
                        <span className="img-section">
                          <img src={obj.images.fixed_width_still.url} />
                        </span>
                      </li>
                    );
                  })}
                {this.state.ghipyList &&
                  this.state.ghipyList.length <= 0 &&
                  this.state.term && (
                    <li className="mb-2 width-100-li">
                      <span>
                        Sorry, we couldn't find any photos for "
                        {" " + this.state.term + " "} " Try searching something
                        related.
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        }
        {/*this.state.photosData && (
          <div
            className={
              this.state.photosData.length !== 0 ? "row mt-4" : "row mt-2"
            }
          >
            {this.state.photosData && this.state.photosData.length !== 0 && (
              <div className="col-md-12 col-sm-12">
                <span className="poster-heading">Trending</span>
              </div>
            )}
            <div className="col-md-12 col-sm-12 mt-2">
              <ul className="category-section">
                {this.state.photosData.map((obj, id) => {
                  return (
                    <li
                      className="mb-2"
                      key={id}
                      onClick={() => addImage(canvas, obj.image_url)}
                    >
                      <span className="img-section">
                        <img src={obj.image_url} />
                      </span>
                    </li>
                  );
                })}
                {this.state.photosData &&
                  this.state.photosData.length <= 0 &&
                  this.state.term && (
                    <li className="mb-2 width-100-li">
                      <span>
                        Sorry, we couldn't find any photos for "
                        {" " + this.state.term + " "} " Try searching something
                        related.
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        )*/}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};
  //console.log(state);
  if (state.SidebarReducer.action == "GET_GIPHY_IMAGES") {
    if (
      state.SidebarReducer.data.meta &&
      state.SidebarReducer.data.meta.status !== 200
    ) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.ghipyData = state.SidebarReducer.data.data;
      returnState.giphyListDate = new Date();
    }
  }

  if (state.SidebarReducer.action == "SEARCH_GIPHY_IMAGES") {
    if (
      state.SidebarReducer.data.meta &&
      state.SidebarReducer.data.meta.status !== 200
    ) {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.ghipyData = state.SidebarReducer.data.data;
      returnState.giphyListDate = new Date();
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
      getGiphy: getGiphy,
      scrollState: scrollState,

      giphySearch: giphySearch,
      exportEmptyData: exportEmptyData,

      exportEmptyData: exportEmptyData,
      getSelectedType: getSelectedType,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GiphySection));
