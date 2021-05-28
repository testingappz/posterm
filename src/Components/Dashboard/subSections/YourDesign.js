import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { fabric } from "fabric";
import Masonry from "react-masonry-css";
//import Masonry from "react-masonry-component";
import "fabric-history";
import lzwCompress from "lzwcompress";

import {
  getUserCanvas,
  loadCanvas,
  deleteCanvas,
} from "../../../Actions/canvasExternalActions.js";
import { getTemplates } from "../../../Actions/templatesActions.js";
import { getVideoElement } from "../Handlers/Handlers.js";
import {
  getCanvas,
  toolsMenu,
  showAdjustments,
  showFilters,
  sideBar2,
  getSelectedType,
} from "../../../Actions/canvasActions.js";
import { v4 } from "uuid";

class YourDesign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: "",
      canvasList: [],
      userCanvas: {},
      loadedCanvas: {},
      canvasData: {},
      canvasObject: "",
      cid: this.props.match.params.id,
      cg: this.props.match.params.cg,
    };
  }

  componentDidMount() {
    this.props.getUserCanvas();
  }

  static getDerivedStateFromProps(props, state) {
    //console.log(props);
    let returnState = {};
    if ((props.canvas !== undefined) & (props.canvas !== "")) {
      returnState.canvas = props.canvas ? props.canvas : "";
    }
    if (
      props.userCanvas !== undefined &&
      props.userCanvas.status == "200" &&
      props.userCanvas !== state.userCanvas &&
      props.userDate !== state.userDate
    ) {
      returnState.canvasList = props.userCanvas ? props.userCanvas.data : [];
      returnState.userDate = props.userDate;
      /*if (props.callData == true) {
        returnState.callData = false;
        props.getUserCanvas();
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

      let canvasSize = JSON.parse(props.canvasData.canvas_size);
      let category = props.canvasData.category;
      let canvasId = props.canvasData ? props.canvasData._id : state.cid;
      let canvasChange = document.getElementsByTagName("canvas")[0];
      for (var a in sessionStorage) {
        if (a[0] + a[1] == "J-") {
          sessionStorage.removeItem(a);
        }
      }
      // sessionStorage.removeItem("J-" + state.cid);
      canvasChange.width = canvasSize.width;
      canvasChange.height = canvasSize.height;
      let containerWidth = 1150;
      let containerHeight = 560;
      let scaleRatio = Math.min(
        containerWidth / canvasSize.width,
        containerHeight / canvasSize.height
      );
      sessionStorage.setItem("size", JSON.stringify(canvasSize));
      returnState.canvas.setDimensions({
        width: canvasSize.width * scaleRatio,
        height: canvasSize.height * scaleRatio,
      });

      returnState.canvas.setZoom(scaleRatio);
      //console.log(props.canvasData);
      //localStorage.setItem("J", returnState.canvasObject);
      //console.info(JSON.parse(returnState.canvasObject));
      let data = JSON.parse(returnState.canvasObject);
      //console.log(data);
      returnState.canvas.loadFromJSON(
        JSON.stringify(data),
        canvasLoaded,
        async function (o, object) {
          // fabric.log(o, object);
          if (object && object.maskname && object.type !== "image") {
            //object.set("selectable", false);
            returnState.canvas.bringForward(object);
          }
          if (object && object.maskname && object.myImage) {
            console.log("my Inside");
            await new Promise((resolve, reject) => {
              if (object.maskname && object.fill == null && object.myImage) {
                fabric.Object.prototype.transparentCorners = false;
                //console.log(pattrenName);
                var padding = 0;
                var padding = 0;

                let pugImg = new Image();
                pugImg.crossOrigin = "anonymous";
                pugImg.src = object.myImage;

                //console.log(size.zoom);
                pugImg.onload = function (img) {
                  let pug = new fabric.Image(pugImg, {
                    //width: 500,
                  });

                  if (object.maskname == "heart") {
                    pug.scaleToWidth(700);
                  } else if (object.maskname === "bili") {
                    pug.scaleToWidth(700);
                    pug.scaleToHeight(1000);
                  } else {
                    pug.scaleToWidth(500);
                  }
                  var patternSourceCanvas = new fabric.StaticCanvas();
                  patternSourceCanvas.add(pug);
                  patternSourceCanvas.renderAll();
                  var pattern = new fabric.Pattern({
                    source: function () {
                      if (pug.getScaledWidth()) {
                        patternSourceCanvas.setDimensions({
                          width: pug.getScaledWidth() + padding,
                          height: pug.getScaledHeight() + padding,
                        });
                      }
                      patternSourceCanvas.renderAll();
                      return patternSourceCanvas.getElement();
                    },
                    repeat: "no-repeat",
                  });

                  object.set({ fill: pattern });
                  returnState.canvas.requestRenderAll();
                };
              }
            });
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
              objs[i]["flipY"],
              objs[i]["locked"]
            );
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
      /*returnState.canvas.loadFromJSON(
        returnState.canvasObject,
        returnState.canvas.renderAll.bind(returnState.canvas)
      );*/

      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: false,
        showFlip: false,
        templateChange: true,
        category: category,
        myDesign: true,
        template: false,
        cid: canvasId ? canvasId : v4(),
      };
      // props.getSelectedType("");
      let tempData = {
        category: state.cg ? state.cg : "cus",
      };
      lzwCompress.pack(
        sessionStorage.setItem("J-" + canvasId, returnState.canvasObject)
      );
      let random = Math.random().toString(36).substring(7);
      props.getTemplates(tempData);
      props.getCanvas(returnState.canvas);
      props.toolsMenu(formData);
      returnState.canvas.renderAll();
      props.history.push(`/design/${canvasId}/edit/${category}&cat=${random}`);
    }

    return returnState;
  }

  loadOnCanvas = (id) => {
    let formData = {
      id: id,
    };
    this.props.loadCanvas(formData);
  };

  handleDelete = (id) => {
    if (id) {
      this.props.deleteCanvas(id);
    }
  };

  render() {
    const masonryOptions = {
      transitionDuration: 0,
    };
    const imagesLoadedOptions = { background: ".my-bg-image-el" };
    return (
      <div className="folders-edit-category mt-4">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Your Design</span>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-sm-12 mt-2">
            {this.state.canvasList && this.state.canvasList.length == 0 && (
              <div className="text-no-img mt-3">
                <span>You have not created any poster yet!</span>
              </div>
            )}
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {this.state.canvasList &&
                this.state.canvasList.length > 0 &&
                this.state.canvasList.map((obj, id) => {
                  return (
                    <div key={id} className="myDesign">
                      <span className="">
                        <span
                          className="delete-btn"
                          onClick={(id) => this.handleDelete(obj._id)}
                        >
                          <i className="fa fa-trash-o" aria-hidden="true"></i>{" "}
                        </span>
                        <img
                          src={obj.canvas_image}
                          onClick={() => this.loadOnCanvas(obj._id)}
                        />
                      </span>
                    </div>
                  );
                })}
            </Masonry>
          </div>
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
  }

  if (state.CanvasExternalReducer.action === "GET_ALL_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "200") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userCanvas = state.CanvasExternalReducer.data;
      returnState.userDate = new Date();
    }
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

  if (state.CanvasExternalReducer.action === "DELETE_USER_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "200") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userCanvas = state.CanvasExternalReducer.data;
      returnState.userDate = new Date();
      returnState.callData = true;
    }
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUserCanvas: getUserCanvas,
      loadCanvas: loadCanvas,
      deleteCanvas: deleteCanvas,
      toolsMenu: toolsMenu,
      getCanvas: getCanvas,
      getTemplates: getTemplates,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(YourDesign));
