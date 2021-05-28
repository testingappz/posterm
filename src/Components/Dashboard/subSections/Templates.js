import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { fabric } from "fabric";
import { v4 } from "uuid";
import lzwCompress from "lzwcompress";
import SyncLoader from "react-spinners/SyncLoader";
import Masonry from "react-masonry-css";

import { loadCanvas } from "../../../Actions/canvasExternalActions.js";
import {
  getTemplates,
  loadTemplate,
  deleteTemplate,
  exportEmptyData,
  templateSearch,
} from "../../../Actions/templatesActions.js";
import { getVideoElement } from "../Handlers/Handlers.js";
import {
  getCanvas,
  toolsMenu,
  showAdjustments,
  showFilters,
  sideBar2,
  getSelectedType,
} from "../../../Actions/canvasActions.js";

class Templates extends Component {
  constructor(props) {
    super(props);
    let user = JSON.parse(localStorage.getItem("useMe"));
    this.state = {
      cg: this.props.match.params.cg,
      cid: this.props.match.params.id,
      canvas: "",
      canvasData: {},
      canvasObject: "",
      templateData: {},
      templateList: [],
      loadedTemplate: {},
      templateObject: "",
      showAll1: false,
      loadedTemplateId: "",
      userEmail: user ? user.email : "",
      term: "",
      showLoader: false,
      page: 1,
      showLoader: false,
      totalPages: "",
      currentPage: 1,
      hasMore: true,
      scrolling: false,
      loadMore: {},
      showTerm: "",
      height: "",
    };
  }

  componentDidMount() {
    if (this.state.cg === "fac") {
      this.setState({ height: "126px" });
    }
    if (this.state.cg === "pos") {
      this.setState({ height: "211px" });
    }

    if (this.state.cg === "fly") {
      this.setState({ height: "211px" });
    }

    if (this.state.cg === "pre") {
      this.setState({ height: "89px" });
    }

    if (this.state.cg === "log") {
      this.setState({ height: "156px" });
    }

    if (this.state.cg === "soc") {
      this.setState({ height: "149px" });
    }

    if (this.state.cg === "ins") {
      this.setState({ height: "265px" });
    }

    if (this.state.cg === "you") {
      this.setState({ height: "84px" });
    }

    if (this.state.cg === "inp") {
      this.setState({ height: "149px" });
    }

    let formData = {
      category: this.state.cg ? this.state.cg : "cus",
      page: 1,
    };
    //console.log("hell");
    this.setState({ showLoader: true });
    this.props.getTemplates(formData);
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas ? props.canvas : "";
    }
    if (props.templateData !== undefined && state.templateList.length == 0) {
      //console.log(props.templateData);
      props.exportEmptyData();
      returnState.templateList = props.templateData.data
        ? props.templateData.data
        : [];
      returnState.showLoader = false;
      returnState.currentPage = props.templateData.meta
        ? props.templateData.page
        : 1;
      returnState.page = props.templateData ? props.templateData.page : 1;
      returnState.scrolling = false;
      returnState.hasMore = props.templateData
        ? props.templateData.has_more
        : true;
    } else if (
      props.templateData !== undefined &&
      state.templateList.length !== 0 &&
      props.templateDataDate !== state.templateDataDate
    ) {
      props.exportEmptyData();
      returnState.templateDataDate = props.templateDataDate;
      returnState.templateList = [
        ...state.templateList,
        ...props.templateData.data,
      ];

      returnState.showLoader = false;
      returnState.scrolling = false;
      returnState.page = props.templateData ? props.templateData.page : 1;

      returnState.currentPage = props.templateData
        ? props.templateData.page
        : 1;

      returnState.hasMore = props.templateData
        ? props.templateData.has_more
        : true;
    }

    if (
      props.loadMore !== undefined &&
      props.loadMore !== state.loadMore &&
      props.loadMoreDate !== state.loadMoreDate
    ) {
      returnState.loadMoreDate = props.loadMoreDate;
      returnState.loadMore = props.loadMore;
      if (
        returnState.loadMore.template == true &&
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term == ""
      ) {
        if (state.hasMore) returnState.page = state.currentPage + 1;

        let formData = {
          page: returnState.page,
          term: state.term,
          category: state.cg ? state.cg : "cus",
        };

        if (state.hasMore && !state.showLoader) {
          returnState.showLoader = true;
          returnState.scrolling = true;
          //console.log("2");
          props.getTemplates(formData);
        }
      }

      if (
        returnState.loadMore.page !== state.page &&
        returnState.loadMore.scrolling == true &&
        state.term
      ) {
        if (state.hasMore) returnState.page = state.currentPage + 1;
        let formData = {
          page: returnState.page,
          term: state.term,
          category: state.cg ? state.cg : "cus",
        };
        if (state.hasMore && !state.showLoader) {
          returnState.showLoader = true;
          returnState.scrolling = true;

          props.getTemplates(formData);
        }
      }
    }

    if (
      props.loadedTemplate !== undefined &&
      props.loadedTemplate !== state.loadedTemplate &&
      props.loadDate !== state.loadDate
    ) {
      returnState.loadedTemplate = props.loadedTemplate;
      returnState.templateObject = props.loadedTemplate
        ? props.loadedTemplate.template
        : "";
      returnState.loadedTemplateId = props.loadedTemplate
        ? props.loadedTemplate._id
        : "";
      for (var a in sessionStorage) {
        if (a[0] + a[1] == "J-") {
          sessionStorage.removeItem(a);
        }
      }
      //sessionStorage.removeItem("J-" + state.cid);
      let templateSize = JSON.parse(props.loadedTemplate.template_size);
      returnState.cg = props.loadedTemplate
        ? props.loadedTemplate.category
        : "cus";
      let category = props.loadedTemplate
        ? props.loadedTemplate.category
        : "cus";
      sessionStorage.setItem("LTID", props.loadedTemplate._id);
      if (templateSize) {
        sessionStorage.setItem("size", JSON.stringify(templateSize));
      }
      //localStorage.setItem("J", returnState.templateObject);
      let data = JSON.parse(returnState.templateObject);
      //console.log(data);
      //s console.log(data);
      //console.log(data);
      let obj = returnState.canvas.getObjects();
      //console.log(obj.length);
      //canvas.remove(objx);
      //let vidId = objx.videoId;
      //var vid = document.getElementById(vidId);
      if (obj && obj.length) {
        for (let i = 0; i <= obj.length; i++) {
          var vid = document.querySelector("video");
          if (vid) {
            vid.muted = "muted";
            vid.pause();
            vid.src = "";
            vid.removeAttribute("src");
            vid.parentNode.removeChild(vid);
            //vid.hide();
            //vid.empty()
          }
        }
      }
      returnState.canvas.loadFromJSON(
        JSON.stringify(data),
        canvasLoaded,
        function (o, object) {
          if (object && object.maskname && object.type !== "image") {
            //clipPath = object;
            object.set("selectable", false);
            /*object.set({
              clipTo: function (ctx) {
                var circle = new fabric.Circle({
                  radius: 100,
                  fixed: true,
                  fill: "",
                  top: object.top,
                  left: object.left,
                  scaleX: 1,
                  scaleY: 1,
                  maskname: "circle",
                  absolutePositioned: true,
                  stroke: "1",
                });
                ctx.crossOrigin = "";
                circle._render(ctx, false);
              },
            });*/
          }
        }
      );
      function canvasLoaded() {
        returnState.canvas.renderAll.bind(data);
        var objs = data["objects"];
        for (var i = 0; i < objs.length; i++) {
          if (objs[i].hasOwnProperty("video_src")) {
            //console.log(i);
            getVideoElement(
              returnState.canvas,
              objs[i]["video_src"],
              objs[i]["left"],
              objs[i]["top"],
              objs[i]["scaleX"],
              objs[i]["scaleY"],
              i,
              objs[i]["opacity"],
              objs[i]["flipX"],
              objs[i]["flipY"]
            );
            // console.log(returnState.canvas.getObjects());
            // localStorage.setItem("J", returnState.canvas);
            /*var fab_video = new fabric.Image(videoE, {
              left: objs[i]["left"],
              top: objs[i]["top"],
            });
            canvas.add(fab_video);
            fab_video.getElement().play();
            fabric.util.requestAnimFrame(function render() {
              canvas.renderAll();
              fabric.util.requestAnimFrame(render);
            });*/
          }
        }
      }
      let random = Math.random().toString(36).substring(7);
      let id = v4();
      /*returnState.canvas.loadFromJSON(
        JSON.parse(returnState.templateObject),

        returnState.canvas.renderAll.bind(returnState.canvas)
      );

      // returnState.canvas.historyUndo = [];
      returnState.canvas.renderAll.bind(returnState.canvas);*/
      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: false,
        showFlip: false,
        templateChange: true,
        category: category,
        cid: id,
        template: true,
        myDesign: false,
      };
      // props.getSelectedType("");
      lzwCompress.pack(
        sessionStorage.setItem("J-" + id, returnState.templateObject)
      );
      returnState.cid = id;
      props.toolsMenu(formData);
      props.getCanvas(returnState.canvas);
      props.sideBar2(false);
      props.showFilters(false);
      props.showAdjustments(false);
      props.history.push(`/design/${id}/edit/${category}&cat=${random}`);
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

  /*loadOnCanvas = () => {
    let formData = {
      id: "5ecf61836129a51cdf75e3ba",
    };
    this.props.loadCanvas(formData);
  };*/
  loadOnTemplate = (id) => {
    let formData = {
      id: id,
    };
    this.props.loadTemplate(formData);
  };

  handleDelete = (id) => {
    if (id) {
      this.props.deleteTemplate(id);
    }
  };

  handleSearchClose = () => {
    let formData = {
      page: 1,
      category: this.state.cg ? this.state.cg : "cus",
    };
    this.props.getTemplates(formData);
    this.setState({
      term: "",
      showLoader: true,
      templateList: [],
      searchActive: false,
      showTerm: "",
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.exportEmptyData();
    if (this.state.term) {
      let formData = {
        term: this.state.term,
        category: this.state.cg ? this.state.cg : "cus",
        page: 1,
      };
      this.setState({
        templateList: [],
        searchActive: true,
        showLoader: true,
        showTerm: this.state.term,
      });
      this.props.getTemplates(formData);
      //this.props.templateSearch(formData);
    } else {
      let formData = {
        page: 1,
        category: this.state.cg ? this.state.cg : "cus",
      };
      this.props.getTemplates(formData);
      this.setState({
        templateList: [],
        searchActive: false,
        showLoader: true,
        showTerm: "",
      });
    }
  };

  render() {
    let admin = "testing@yopmail.com";
    return (
      <div className="templates-category mt-4">
        <div className={""}>
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
                    placeholder="Search Template"
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
            <div
              className={
                this.state.templateList.length !== 0 ? "row mt-4" : "row mt-2"
              }
            >
              {/* <div className="col-md-12 col-sm-12">
              <span className="poster-heading">Mother's Day Card</span>
              <a href="#" className="see-all">
                See all
              </a>
            </div>*/}
              <div className="col-md-12 col-sm-12 mt-2 mb-4">
                <Masonry
                  breakpointCols={2}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {this.state.templateList &&
                    this.state.templateList.length > 0 &&
                    this.state.templateList.map((obj, id) => {
                      return (
                        <div
                          key={id}
                          className="myDesignVideos"
                          style={{ height: this.state.height }}
                        >
                          <span className="">
                            {(this.state.userEmail === admin ||
                              this.state.userEmail ===
                                "testingadmin@yopmail.com") && (
                              <span
                                className="delete-btn"
                                onClick={(id) => this.handleDelete(obj._id)}
                              >
                                <i
                                  className="fa fa-trash-o"
                                  aria-hidden="true"
                                ></i>{" "}
                              </span>
                            )}
                            <img
                              src={obj.template_image}
                              onClick={() => this.loadOnTemplate(obj._id)}
                            />
                          </span>
                        </div>
                      );
                    })}
                </Masonry>
                {this.state.templateList &&
                  this.state.templateList.length <= 0 &&
                  !this.state.showLoader &&
                  this.state.searchActive && (
                    <span className={"error-text"}>
                      Sorry, we couldn't find any template for "
                      {" " + this.state.showTerm + " "} " Try searching
                      something related.
                    </span>
                  )}

                {/*this.state.templateList &&
                  this.state.templateList.length <= 0 &&
                  !this.state.showLoader && (
                    <span
                      className={this.state.term ? "noDisplay" : "error-text"}
                    >
                      Sorry, we couldn't find any template for this category
                    </span>
                  )*/}

                {this.state.templateList &&
                  this.state.templateList.length <= 0 &&
                  this.state.showLoader && (
                    <span
                      className={"error-text"}
                      style={{ textaAlign: "center" }}
                    >
                      <SyncLoader
                        size={10}
                        color={"#ffffff"}
                        loading={this.state.showLoader}
                      />
                    </span>
                  )}

                {this.state.templateList &&
                  this.state.templateList.length &&
                  this.state.showLoader &&
                  this.state.scrolling && (
                    <span
                      className={this.state.term ? "noDisplay" : "error-text"}
                      style={{ textaAlign: "center" }}
                    >
                      <SyncLoader
                        size={10}
                        color={"#ffffff"}
                        loading={this.state.showLoader}
                      />
                    </span>
                  )}
              </div>
            </div>
          }

          {/*<div className="row mt-5">
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
    returnState.loadMoreDate = new Date();
  }
  if (state.CanvasExternalReducer.action === "LOAD_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.canvasData = state.CanvasExternalReducer.data;
      //console.log(canvasData);
    }
  }

  if (state.TemplateReducer.action === "GET_TEMPLATES") {
    if (state.TemplateReducer.data.status !== 200) {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.templateData = state.TemplateReducer.data;
      // console.log(returnState.templateData);
      returnState.templateDataDate = new Date();
    }
  }

  if (state.TemplateReducer.action === "LOAD_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.loadedTemplate = state.TemplateReducer.data;
      returnState.loadDate = new Date();
    }
  }

  if (state.TemplateReducer.action === "DELETE_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "200") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.templateData = state.TemplateReducer.data;
      // console.log(returnState.templateData);
    }
  }

  if (state.TemplateReducer.action === "SEARCH_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "200") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.templateData = state.TemplateReducer.data;
      // console.log(returnState.templateData);
    }
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadCanvas: loadCanvas,
      getTemplates: getTemplates,
      loadTemplate: loadTemplate,
      deleteTemplate: deleteTemplate,
      templateSearch: templateSearch,
      getCanvas: getCanvas,
      toolsMenu: toolsMenu,
      showAdjustments: showAdjustments,
      showFilters: showFilters,
      sideBar2: sideBar2,
      getSelectedType: getSelectedType,
      exportEmptyData: exportEmptyData,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Templates));
