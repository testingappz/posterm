import React, { Component } from "react";
import { fabric } from "fabric";
import "fabric-history";
import "fabric-customise-controls";
import RecordRTC from "recordrtc";
import { v4 } from "uuid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import lzwCompress from "lzwcompress";
import {
  deleteObjects,
  setItalic,
  setBold,
  cancelCrop,
  getVideoElement,
  copyObject,
  ungroup,
} from "./Handlers/Handlers.js";
import {
  fillMe,
  clipMyObject,
  circleMask,
  pattrenMe,
} from "./Handlers/Masking.js";
import { initCenteringGuidelines } from "./Handlers/CenterGuidelines.js";
import { initAligningGuidelines } from "./Handlers/AlignGuidlines.js";
import {
  setBackground,
  emptyData,
  getCanvas,
  getSelectedType,
  activeObjectIndex,
  undoRedo,
  headerMenu,
  sideBar2,
  toolsMenu,
  showFilters,
  showAdjustments,
  mainSideBarState,
  cropState,
  backgroundState,
} from "../../Actions/canvasActions.js";
import WhatsappPlugin from "./WhatsappPlugin.js";
import FbPlugin from "./FbPlugin.js";
import ToolsHeader from "./ToolsHeader.js";
import { element } from "prop-types";

class Canvas extends Component {
  constructor(props) {
    super(props);
    //const J = JSON.parse(localStorage.getItem("J"));
    const canvasId = localStorage.getItem("canvasId");
    const sizeData = JSON.parse(sessionStorage.getItem("size"));
    const userDetails = JSON.parse(localStorage.getItem("useMe"));
    const zoomValue = sizeData
      ? "scale(" + sizeData.zoomValue + ")"
      : "scale(0.4)";
    // console.log(zoomValue);
    this.myRef = React.createRef();
    this.state = {
      canvasId: this.props.match.params.id,
      cid: this.props.match.params.id,
      category: this.props.match.params.cg,
      canvas: "",
      canvasBackground: "",
      imgUrl: "",
      text: "",
      italic: false,
      bold: false,
      selectedType: "",
      zoom: sizeData ? zoomValue : "0.6",
      fabricObject: {},
      activeObjIndex: -1,
      localJ: "",
      undoButton: false,
      redoButton: false,
      cropActive: false,
      defaultScale: "0.24",
      clipSrc: "",
      email: userDetails ? userDetails.email : "",
      name: userDetails ? userDetails.name : "",
    };
    this.escFunction = this.escFunction.bind(this);
  }

  componentDidMount() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }); // disable right click

    this.props.cropState(false);

    const J = lzwCompress.unpack(
      JSON.parse(sessionStorage.getItem("J-" + this.state.cid))
    );
    // console.log(J);
    this.setState({ localJ: J });

    const canvas = new fabric.Canvas(
      this.state.cid,
      {
        width: this.props.cWidth,
        height: this.props.cHeight,
        selection: true,
        id: this.state.cid,
        //selectionBorderColor: "green",
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        uniScaleTransform: true,
        //cornerSize: 40,
        lockScalingFlip: true,
        controlsAboveOverlay: true,
        subTargetCheck: true,
        hoverCursor: "pointer",
        stateful: true,
      },
      null,
      "anonymous"
    );

    fabric.Object.prototype.set({
      padding: 5,
      borderScaleFactor: 2,
      cornerStrokeColor: "#7D7D7D",
      controlsAboveOverlay: true,
    });

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["maskname"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["myImage"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["isShape"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["isMask"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["myType"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["video_src"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["videoId"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat([
          "videoVolume",
        ]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["locked"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);

    fabric.Canvas.prototype.customiseControls(
      {
        mtr: {
          action: "rotate",
          cursor: "pointer",
        },
      },
      function () {
        canvas.renderAll();
      }
    );
    fabric.Object.prototype.customiseCornerIcons(
      {
        settings: {
          borderColor: "#c00c41",
          cornerSize: 12,
          cornerShape: "circle",
          cornerBackgroundColor: "#ffffff",
          cornerPadding: 5,
          controlsAboveOverlay: true,
        },
        tl: {
          icon: "",
        },
        tr: {
          icon: "",
        },
        bl: {
          icon: "",
        },
        br: {
          //icon: "/icons/up.svg",
        },

        mtr: {
          icon: "/img/reload.svg",
        },
      },
      function () {
        canvas.renderAll();
      }
    );

    this.setState({ canvas: canvas });

    setTimeout(() => {
      let data = this.state.localJ;
      var localJ = this.state.localJ;
      // console.log(data);
      /*var json = canvas.toJSON();
      json.objects.forEach((object) => {
        if (object.clipPath) {
          fabric.util.enlivenObjects([object.clipPath], function (arg1) {
            object.clipPath = arg1[0];
          });
        }
      });*/

      if (data) {
        var clipPath;
        canvas.loadFromJSON(
          JSON.stringify(data),
          canvasLoaded(),
          async function (
            // cavasLoaded prev state was canvasLoaded only without brackets
            o,
            object
          ) {
            if (object && object.maskname && object.type !== "image") {
              //object.set("selectable", false);
              canvas.bringForward(object);
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
            if (object && object.maskname && object.myImage) {
              console.log("my Inside");
              await new Promise((resolve, reject) => {
                /*pattrenMe(
                  canvas,
                  object.myImage,
                  object.left,
                  object.top,
                  0,
                  object.maskname,
                  object.scaleX,
                  object.scaleY,
                  object.width,
                  object.height,
                  object.radius
                );*/
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
                    canvas.requestRenderAll();
                  };
                }

                //success handler function is invoked

                //canvas.sendToBack(object);
                /*if (object.maskname == "rect") {
              var imageSource = object.src;
              canvas.remove(object);
              var Rect = new fabric.Rect({
                width: 400,
                height: 400,
                fixed: true,
                fill: "",
                scaleX: 1,
                scaleY: 1,
                maskname: "rect",
                absolutePositioned: true,
                stroke: "1",
                lockScalingFlip: true,
                lockUniScaling: true,
                minScaleLimit: 0.1,
              });

              fillMe(canvas, imageSource, Rect);
            }*/
                //object.set("clipPath", null);
                //object.set("fixed", false);
                //object.set(("absolutePositioned", false));
                // object.set(("clipPath", clipPath));
                /*object.set({
              clipTo: function (ctx) {
                clipMyObject(clipPath, ctx);
                //ctx.crossOrigin = "";
              },
            });*/
                //  / object.set("clipPath", null);
              });
            }
          }
        );
        function canvasLoaded() {
          canvas.renderAll.bind(data);
          var objs = data["objects"];
          var bin;

          for (var i = 0; i < objs.length; i++) {
            if (objs[i].hasOwnProperty("video_src")) {
              //console.log(i);
              getVideoElement(
                canvas,
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
            }
          }
        }
      }
      let containerWidth = 1150;
      let containerHeight = 560;
      let scaleRatio = Math.min(
        containerWidth / this.props.cWidth,
        containerHeight / this.props.cHeight
      );

      canvas.setDimensions({
        width: canvas.getWidth() * scaleRatio,
        height: canvas.getHeight() * scaleRatio,
      });

      canvas.setZoom(scaleRatio);

      this.setState({ defaultScale: scaleRatio, zoom: scaleRatio });
      this.props.getCanvas(canvas);
    }, 0);
    setTimeout(() => {
      /*if (canvas && canvas._objects) {
        let allObjects = canvas ? canvas._objects : [];
        allObjects.map((obj, id) => {
          if (obj.type == "image" && obj.clipPath) {
            canvas.remove(obj);
          }
          if (obj.type == "path") {
            canvas.remove(obj);
          }
        });
      }*/
      // if (canvas && canvas._objects) {
      //   let allObjects = canvas ? canvas._objects : [];
      //   allObjects.map((obj, id) => {
      //     if (obj && obj.maskname && obj.type == "image" && obj.src) {
      //       //console.log("hell");
      //       this.setState({ clipSrc: obj.src ? obj.src : "" });
      //       //canvas.remove(obj);
      //     }
      //   });
      // }
    }, 500);
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  escFunction(event) {
    //console.log(event);
    //console.log(event.which);
    if (event && event.code === "F12" && event.keyCode === 123) {
      this.disabledEvent(event);
      return false;
    }
    let canvas = this.state.canvas;
    let activeObj = canvas ? canvas.getActiveObject() : {};
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 38 /* Up arrow */:
          if (canvas.getActiveObject()) {
            canvas.getActiveObject().top -= 5;
            canvas.renderAll();
          }
          break;
        case 40 /* Down arrow  */:
          if (canvas.getActiveObject()) {
            canvas.getActiveObject().top += 5;
            canvas.renderAll();
          }
          break;
        case 37 /* Left arrow  */:
          if (canvas.getActiveObject()) {
            canvas.getActiveObject().left -= 5;
            canvas.renderAll();
          }
          break;
        case 39 /* Right arrow  */:
          if (canvas.getActiveObject()) {
            canvas.getActiveObject().left += 5;
            canvas.renderAll();
          }
          break;
      }
    };

    if (navigator.appVersion.indexOf("Macintosh") !== -1) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        if (
          activeObj &&
          activeObj.type === "textbox" &&
          activeObj.hasControls === true &&
          event.key === "Delete"
        ) {
          this.deleteSelected(event);
        }
        if (activeObj && activeObj.type !== "textbox") {
          this.deleteSelected(event);
        }
      }
    } else {
      if (event.keyCode === 46) {
        if (
          activeObj &&
          activeObj.type === "textbox" &&
          activeObj.hasControls === true
        ) {
          this.deleteSelected(event);
        }
        if (activeObj && activeObj.type !== "textbox") {
          this.deleteSelected(event);
        }
      }
    }

    if (
      event &&
      event.code === "KeyC" &&
      event.keyCode === 67 &&
      event.ctrlKey == true
    ) {
      //console.log(event);
      if (canvas.getActiveObject()) {
        copyObject(canvas);
      }
    }

    if (event.which === 123) {
      this.disabledEvent(event);
      return false;
    }
  }

  disabledEvent = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
    e.preventDefault();
    return false;
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    if (props.canvas !== undefined && props.canvas !== "") {
      let canvas = props.canvas;

      returnState.canvas = props.canvas;
    }
    if (
      props.cropActive !== undefined &&
      props.cropActive !== "" &&
      props.cropActive !== state.cropActive &&
      props.cropStateDate !== state.cropStateDate
    ) {
      returnState.cropActive = props.cropActive;
      returnState.cropStateDate = props.cropStateDate;
    }
    if (
      props.toolsState !== undefined &&
      props.toolsState !== state.toolsState
    ) {
      if (props.toolsState && props.toolsState.cid) {
        returnState.cid = props.toolsState.cid;
      }
    }
    if (
      props.showMainSideBar !== undefined &&
      props.showMainSideBar !== state.showMainSideBar
    ) {
      returnState.showMainSideBar = props.showMainSideBar;
    }
    return returnState;
  }

  componentDidUpdate(prevProps, prevState) {
    const size = JSON.parse(sessionStorage.getItem("size"));
    let canvas = this.state.canvas;
    const sizeData = JSON.parse(sessionStorage.getItem("size"));
    let selectedObject = canvas ? canvas.getActiveObject() : "";
    let bin;
    let allObjects = canvas.getObjects();

    // console.log(allObjects);
    allObjects &&
      allObjects.length &&
      allObjects.map((obj, id) => {
        //console.log(obj);
        if (
          obj.maskname &&
          obj.type !== "image" &&
          obj.myImage &&
          obj.fill === null
        ) {
          //canvas.remove(obj);
        }
        if (obj.maskname && obj.type !== "image" && obj.isShape) {
          bin = obj;
        }
      });

    //console.log("bin", bin);
    //console.log(selectedObject);

    // initAligningGuidelines(canvas);
    //initAligningGuidelines(canvas);
    //initCenteringGuidelines(canvas);
    let src;
    if (selectedObject && selectedObject._element) {
      src = selectedObject._element ? selectedObject._element.src : "";
      //selectedObject.set("visible", true);
      //selectedObject.set("globalCompositeOperation", "");
    }
    //console.log(selectedObject);
    //   console.log(bin);

    if (
      bin &&
      !bin._transformDone &&
      selectedObject &&
      selectedObject.myType == "image" &&
      src !== this.state.clipSrc &&
      (selectedObject.clipPath == null || selectedObject.clipPath == undefined)
    ) {
      this.setState({ clipSrc: src });
      let myState = this.state.clipSrc;
      let category = this.state.category;
      canvas.on("mouse:up", function (e) {
        //console.log("Kalesh");
        if (
          e &&
          e.target &&
          e.target._originalElement &&
          e.target._originalElement.nodeName == "IMG" &&
          bin
        ) {
          //bin.set("selectable", true);
          var x = e.e.offsetX;
          var y = e.e.offsetY;
          //console.log("X", x);
          //console.log("Y", y);
          //console.log("bin", bin.left);
          //console.log("bin", bin.top);

          if (
            x > bin.left &&
            x < bin.left + bin.width &&
            y > bin.top &&
            y < bin.top + bin.height
          ) {
            if (bin) {
              //fillMe(canvas, src, bin, category);
              //console.log("india1");
              pattrenMe(
                canvas,
                src,
                bin.left,
                bin.top,
                0,
                bin.maskname,
                bin.scaleX,
                bin.scaleY,
                bin.width,
                bin.height,
                bin.radius
              );
              // canvas.bringForward(bin);
              //selectedObject.set("selectable", false);
              setTimeout(() => {
                canvas.remove(bin);
                canvas.remove(selectedObject);
                src = "";
              }, 100);
            }
          } else {
            var targ = e.target;

            // this fixes it
            if (targ) {
              targ.setCoords();

              var items = canvas.getObjects().filter(function (o) {
                return targ !== o;
              });

              var hit = false;

              for (var i = 0, n = items.length; i < n; i++) {
                var m = items[i];

                if (targ.intersectsWithObject(m)) {
                  if (bin) {
                    // fillMe(canvas, src, bin, category);
                    // console.log("india2");
                    pattrenMe(
                      canvas,
                      src,
                      bin.left,
                      bin.top,
                      0,
                      bin.maskname,
                      bin.scaleX,
                      bin.scaleY,
                      bin.width,
                      bin.height,
                      bin.radius
                    );
                    canvas.bringForward(targ);
                    //selectedObject.set("selectable", false);
                    setTimeout(() => {
                      canvas.remove(bin);
                      canvas.remove(selectedObject);
                      src = "";
                    }, 100);
                    src = "";
                    //items = [];
                  }

                  hit = true;
                } else {
                  if (!hit) {
                  }
                }
              }
            }
          }
        }
      });
    }

    let localStore = canvas.toJSON();
    if (
      selectedObject &&
      selectedObject.type == "image" &&
      selectedObject.maskname
    ) {
      canvas.on("mouse:up", function (e) {
        //check if user clicked an object
        if (e.target) {
          // canvas.bringForward(bin);
          //canvas.setActiveObject(bin);
          //selectedObject.set("cacheHeight", 720);
          //canvas.bringForward(selectedObject);
        }
      });
      //canvas.sendToBack(bin);
      canvas.on("mouse:dblclick", (e) => {
        if (e.target) {
          // e.target.set("selectable", true);
          // canvas.setActiveObject(e.target);
          //canvas.bringForward(e.target);
        }
      });
      //console.log(selectedObject);
      // selectedObject.set("selectable", false);
      // bin.set("fixed", false);
      // bin.set("selectable", true);
    }

    /*canvas.on("object:moving", (e) => {
      const sizeData = JSON.parse(sessionStorage.getItem("size"));
      if (
        selectedObject &&
        selectedObject.type === "image" &&
        selectedObject.maskname
      ) {
        let bound = bin.getBoundingRect();
        let selectedBound = selectedObject.getBoundingRect();
        console.log("sbound", selectedObject.oCoords.tr.x);
        console.log("bin width", bin.oCoords.tr.x);

        if (selectedObject.left > bin.left) {
          console.log("here");
          selectedObject.set("left", bin.left);
        }
        if (selectedObject.top > bin.top) {
          selectedObject.set("top", bin.top);
        }
        var right = bin.left + bin.getBoundingRect().width / 2;
        var bottom = bin.top + bin.getBoundingRect().height / 2;
        let rightBound = bin.left + bin.getBoundingRect().width;
        let leftBound = bin.top + bin.getBoundingRect().height;
        if (right > e.target.left + e.target.width / 2) {
          //Solution one
          // selectedObject.set("left", bin.left - bin.width);
        }

        /* if (bottom > e.target.top + e.target.height / 2) {
          selectedObject.set("top", bin.top - bin.height / 2);
        }
        // console.log(selectedObject);

        if (selectedBound.left + selectedBound.width < bin.width) {
          console.log("hjfhsafdhagsdf");
          selectedObject.set("left", bin.left - bin.width / 2);
        }*/
    //}
    //});

    canvas.on("object:scaling", (e) => {
      if (
        selectedObject &&
        selectedObject.type === "image" &&
        selectedObject.maskname
      ) {
        selectedObject.set("minScaleLimit", 0.2);
      }
    });

    canvas.on("selection:updated", (event) => {
      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().video_src !== ""
      ) {
        let activeObject = canvas.getActiveObject();
        let activeObjectId = activeObject.videoId ? activeObject.videoId : "";
        let allObjects = canvas.getObjects();

        if (activeObject && activeObject.video_src) {
          if (activeObject.videoVolume) {
            var vid = document.getElementById(activeObjectId);
            let vidName = vid.getAttribute("id");
            vid.muted = activeObject.videoVolume ? false : true;
          }
          if (allObjects && allObjects.length) {
            for (let i = 0; i < allObjects.length; i++) {
              // console.log(allObjects[i]);
              var vid = document.getElementById(
                allObjects[i].videoId ? allObjects[i].videoId : ""
              );
              let vidName = vid ? vid.getAttribute("id") : "";
              if (vid && vidName !== activeObjectId) {
                vid.muted = true;
              }
            }
          }
        }
      }
    });

    if (canvas.getActiveObject() && canvas.getActiveObject().video_src !== "") {
      let activeObjIndex = canvas
        .getObjects()
        .indexOf(canvas.getActiveObject());
      localStorage.setItem("v-position", activeObjIndex);
    }

    if (this.state.cropActive) {
      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().type !== "rect"
      ) {
        // /console.log("insi");
        cancelCrop(canvas);
        this.props.cropState(false);
      }

      canvas.on("object:scaling", (event) => {
        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type === "rect" &&
          this.state.cropActive !== undefined &&
          this.state.cropActive !== false
        ) {
          if (this.state.cropActive) {
            this.checkCropperScaling(); // update cropper scaling
          }
        }
      });

      canvas.on("object:moving", (event) => {
        if (
          canvas.getActiveObject().type === "rect" &&
          this.state.cropActive !== undefined &&
          this.state.cropActive !== false
        ) {
          //console.log("inside");
          if (this.state.cropActive) {
            this.checkCropperMove();
          }
        }
      });
    }
    // let filename = "export.json";
    //let contentType = "application/json;charset=utf-8;";
    //var json = canvas.toJSON();
    if (prevProps.canvas !== prevState.canvas) {
      var objType;

      canvas.on("mouse:down", (options) => {
        //var ungroupText = false;
        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type == "group"
        ) {
          let infected = false;
          let activeHere = canvas.getActiveObject();
          if (activeHere && activeHere._objects) {
            let object = activeHere._objects;

            object.map((obj, id) => {
              if (obj && obj.type !== "textbox") {
                infected = true;
              }
            });
          }
          var groupItems;
          if (options.target) {
            var thisTarget = options.target;
            var mousePos = canvas.getPointer(options.e);
            var editTextbox = false;
            var editObject;
            //console.log(mousePos);
            if (thisTarget.isType("group")) {
              var groupPos = {
                x: thisTarget.left,
                y: thisTarget.top,
              };

              thisTarget.forEachObject(function (object, i) {
                if (object.type == "textbox" && !infected) {
                  var matrix = thisTarget.calcTransformMatrix();
                  var newPoint = fabric.util.transformPoint(
                    { y: object.top, x: object.left },
                    matrix
                  );
                  var objectPos = {
                    xStart: newPoint.x - (object.width * object.scaleX) / 2, //When OriginX and OriginY are centered, otherwise xStart: newpoint.x - object.width * object.scaleX etc...
                    xEnd: newPoint.x + (object.width * object.scaleX) / 2,
                    yStart: newPoint.y - (object.height * object.scaleY) / 2,
                    yEnd: newPoint.y + (object.height * object.scaleY) / 2,
                  };

                  if (
                    mousePos.x >= objectPos.xStart &&
                    mousePos.x <= objectPos.xEnd &&
                    mousePos.y >= objectPos.yStart &&
                    mousePos.y <= objectPos.yEnd
                  ) {
                    function ungroup(group) {
                      //ungroupText = true;
                      groupItems = group._objects;
                      group._restoreObjectsState();
                      canvas.remove(group);
                      for (var i = 0; i < groupItems.length; i++) {
                        if (groupItems[i] != "textbox") {
                          groupItems[i].selectable = false;
                        }
                        canvas.add(groupItems[i]);
                      }

                      canvas.renderAll();
                    }

                    ungroup(thisTarget);
                    canvas.set("ungroupState", "ungroup");
                    canvas.setActiveObject(object);

                    object.enterEditing();
                    object.selectAll();
                    // console.log(canvas);
                    editObject = object;
                    var exitEditing = true;

                    editObject.on("editing:exited", function (options) {
                      //ungroupText = false;
                      if (exitEditing) {
                        var items = [];
                        groupItems.forEach(function (obj) {
                          items.push(obj);
                          canvas.remove(obj);
                        });

                        var grp;
                        grp = new fabric.Group(items, {});

                        canvas.add(grp);
                        canvas.set("ungroupState", "group");
                        exitEditing = false;
                      }
                    });
                  }
                }
              });
              //console.log(exitEditing);
            }
          }
        }

        /*if (ungroupText) {
          let formData = {
            grouping: ungroupText,
          };
          console.log(ungroupText);
          this.props.toolsMenu(formData);
        }*/

        this.saveToJson();
        objType = canvas.getActiveObject() ? canvas.getActiveObject().type : "";
        if (this.state.selectedType !== objType) {
          this.setState({ selectedType: objType });
          if (this.state.selectedType !== "textbox") {
            this.props.sideBar2(false);
          }
          let formData = {
            templateChange: false,
          };
          this.props.toolsMenu(formData);
          //console.log(objType);
          // console.log(canvas.getActiveObject());
          this.props.getSelectedType(objType);
        }

        console.log(options.e.clientX, options.e.clientY);

        let activeObj = canvas.getObjects().indexOf(canvas.getActiveObject());
        if (activeObj !== this.state.activeObjIndex) {
          // let obj = canvas.getObjects();
          this.saveToJson();
          //let actualLength = obj.length;
          //let undoLength = canvas.historyUndo ? canvas.historyUndo.length : 0;
          //let redoLength = canvas.historyRedo ? canvas.historyRedo.length : 0;
          let obj = canvas.getActiveObject();

          //console.log(obj);
          //console.log(activeObj);
          this.props.activeObjectIndex(activeObj);

          this.setState({ activeObjIndex: activeObj });
        }

        let activeObjPop = canvas.getActiveObject();
        if (
          activeObjPop &&
          activeObjPop._objects &&
          activeObjPop._objects.length > 1
        ) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          canvas.getActiveObject().minScaleLimit = 0.1;
        }
      });

      fabric.util.addListener(
        document.getElementsByClassName("upper-canvas")[0],
        "contextmenu",
        function (e) {
          e.preventDefault();
        }
      );

      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().type === "rect"
      ) {
        //update copper coordinates
      }
      canvas.on("mouse:up", (options) => {
        this.saveToJson();
        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type == "textbox"
        ) {
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: true,
            mr: true,
          });
          //console.log("in");
          canvas.getActiveObject().set("lockScalingFlip", true);
          canvas.getActiveObject().lockUniScaling = false;
          canvas.getActiveObject().lockScalingFlip = true;

          canvas.getActiveObject().minScaleLimit = 0.2;

          canvas.getActiveObject().editingBorderColor = "#c00c41";

          this.props.getSelectedType("textbox");
        }
        //console.log(canvas.toJSON());
      });
      canvas.on("object:selected", () => {
        let activeObj = canvas.getActiveObject();
        if (activeObj && activeObj._objects && activeObj._objects.length > 1) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          canvas.getActiveObject().minScaleLimit = 0.1;
        }
        //this.props.getSelectedType(canvas.getActiveObject().type);
        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type == "textbox"
        ) {
          canvas.getActiveObject().set("lockScalingFlip", true);
          canvas.getActiveObject().lockUniScaling = false;
          canvas.getActiveObject().lockScalingFlip = true;

          canvas.getActiveObject().minScaleLimit = 0.2;

          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: true,
            mr: true,
          });
          canvas.getActiveObject().editingBorderColor = "#c00c41";

          // this.props.getSelectedType("textbox");
        }

        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type === "image"
        ) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          if (size && size.width < 500) {
            canvas.getActiveObject().minScaleLimit = 0.01;
          } else {
            canvas.getActiveObject().minScaleLimit = 0.1;
          }
          this.props.getSelectedType("image");
        }

        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type !== "image" &&
          canvas.getActiveObject().type !== "textbox"
        ) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          canvas.getActiveObject().minScaleLimit = 0.1;
        }
      });

      canvas.on("object:scaling", (event) => {
        let activeObj = canvas.getActiveObject();
        if (activeObj && activeObj._objects && activeObj._objects.length > 1) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          canvas.getActiveObject().minScaleLimit = 0.1;
        }
        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type == "textbox"
        ) {
          //console.log(event.target.fontSize);
          /*canvas.forEachObject((obj) => {
          if (obj.type === "i-text" || obj.type === "textbox") {
            obj.set({
              opacity: 1,
              fontSize: event.target.fontSize,
            });
          }
        });*/

          canvas.getActiveObject().set("lockScalingFlip", true);
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;

          canvas.getActiveObject().minScaleLimit = 0.2;

          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: true,
            mr: true,
          });

          /* if (
            canvas.getActiveObject().scaleX < 0.4 &&
            canvas.getActiveObject().scaleY < 0.4
          ) {
            canvas.getActiveObject().lockUniScaling = true;
            canvas.getActiveObject().lockScalingFlip = true;
            canvas.getActiveObject().set("lockScalingFlip", true);
          } else {
            canvas.getActiveObject().lockUniScaling = false;
            canvas.getActiveObject().lockScalingFlip = true;
          }*/
        }

        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type == "image"
        ) {
          canvas.getActiveObject().lockUniScaling = true;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          });
          if (size && size.width < 500) {
            canvas.getActiveObject().minScaleLimit = 0.01;
          } else {
            canvas.getActiveObject().minScaleLimit = 0.1;
          }
          //canvas.getActiveObject().set({});
        }

        if (
          canvas.getActiveObject() &&
          canvas.getActiveObject().type !== "image" &&
          canvas.getActiveObject().type !== "textbox" &&
          canvas.getActiveObject().type == "rect" &&
          (this.state.email == "testing@yopmail.com" ||
            this.state.email == "testingadmin@yopmail.com")
        ) {
          //console.log("indise");
          canvas.getActiveObject().lockUniScaling = false;
          canvas.getActiveObject().lockScalingFlip = true;
          canvas.getActiveObject().setControlsVisibility({
            mt: true,
            mb: true,
            ml: true,
            mr: true,
          });
          canvas.getActiveObject().minScaleLimit = 0.1;
        }
      });

      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().type !== "image" &&
        canvas.getActiveObject().type !== "textbox"
      ) {
        canvas.getActiveObject().lockUniScaling = true;
        canvas.getActiveObject().lockScalingFlip = true;
        canvas.getActiveObject().setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });
        canvas.getActiveObject().minScaleLimit = 0.1;
      }
    }
  }

  checkCropperScaling = () => {
    if (this.state.cropActive) {
      let canvas = this.state.canvas;
      let imageObject = canvas.getObjects();
      let object = {};
      imageObject &&
        imageObject.length &&
        imageObject.map((obj, id) => {
          if (obj.type == "image") {
            object = obj;
          }
        });

      let img = object;
      let obj = canvas.getActiveObject();
      obj.setCoords();
      let b = obj.getBoundingRect();
      let minX = img.oCoords.tl.x;
      let maxX = img.oCoords.br.x;
      let minY = img.oCoords.tl.y;
      let maxY = img.oCoords.br.y;
      if (
        !(
          b.left >= minX &&
          maxX >= b.left + b.width &&
          maxY >= b.top + b.height &&
          b.top >= minY
        )
      ) {
        obj
          .set({
            left: obj.lastLeft,
            top: obj.lastTop,
            scaleX: obj.lastScaleX,
            scaleY: obj.lastScaleY,
          })
          .setCoords();
      } else {
        obj
          .set({
            lastLeft: obj.left,
            lastTop: obj.top,
            lastScaleX: obj.scaleX,
            lastScaleY: obj.scaleY,
          })
          .setCoords();
      }
      canvas.renderAll();
    }
  };

  checkCropperMove = () => {
    if (this.state.cropActive) {
      let canvas = this.state.canvas;
      let imageObject = canvas.getObjects();
      let object = {};
      imageObject &&
        imageObject.length &&
        imageObject.map((obj, id) => {
          if (obj.type == "image") {
            object = obj;
          }
        });

      // debugger;
      let img = object;
      let obj = canvas.getActiveObject();
      obj.setCoords();

      canvas.renderAll();
      let b = obj.getBoundingRect();
      let minX = img.oCoords.tl.x;
      let maxX = img.oCoords.br.x;
      let minY = img.oCoords.tl.y;
      let maxY = img.oCoords.br.y;
      if (!(b.left >= minX && maxX >= b.left + b.width)) {
        obj
          .set({
            left: obj.lastLeft,
            scaleX: obj.lastScaleX,
            scaleY: obj.lastScaleY,
          })
          .setCoords();
      } else {
        obj
          .set({
            lastLeft: obj.left,
            lastScaleX: obj.scaleX,
          })
          .setCoords();
      }
      if (!(maxY >= b.top + b.height && b.top >= minY)) {
        obj
          .set({
            top: obj.lastTop,
            scaleX: obj.lastScaleX,
            scaleY: obj.lastScaleY,
          })
          .setCoords();
      } else {
        obj
          .set({
            lastTop: obj.top,
            lastScaleY: obj.scaleY,
          })
          .setCoords();
      }
      canvas.renderAll();
    }
  };

  fontItalic = () => {
    let canvas = this.state.canvas;
    let italic = this.state.italic;

    setItalic(canvas, italic);

    if (italic) {
      this.setState({ italic: false, text: "" });
    }
    if (!italic) {
      this.setState({ italic: true, text: "" });
    }
  };

  fontBold = () => {
    let canvas = this.state.canvas;
    let bold = this.state.bold;

    setBold(canvas, bold);

    if (bold) {
      this.setState({ bold: false, text: "" });
    }
    if (!bold) {
      this.setState({ bold: true, text: "" });
    }
  };

  deleteSelected = (e) => {
    let canvas = this.state.canvas;
    deleteObjects(canvas);
    this.saveToJson();
    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
      //templateChange: true,
    };
    this.setState({ clipSrc: "" });
    this.props.toolsMenu(formData);
    var objType = canvas.getActiveObject() ? canvas.getActiveObject().type : "";
    this.props.getSelectedType(objType);
    this.setState({ selectedType: objType });
    this.props.sideBar2(false);
    this.props.showFilters(false);
    this.props.showAdjustments(false);
    this.props.mainSideBarState(true);
  };

  handleChange = () => {
    let canvas = this.props.canvas;
    let zoomArr = [0.3, 0.5, 0.6, 0.75, 0.85, 0.9, 1, 1.2, 1.5, 1.59, 2.45];
    var element = document.querySelector(".canvas-inner-box");
    //  console.log(element);
    let value = element.width / element.offsetWidth;
    let indexofArr = 1;
    let val = document.querySelector("#sel").value;
    val = Number(val);
    //console.log("handle change selected value ", val);
    indexofArr = zoomArr.indexOf(val);
    // console.log("Handle changes", indexofArr);
    element.style["transform"] = `scale(${val})`;
    this.setState({ zoom: val });
  };

  goFullScreen = () => {
    var canvas = document.getElementById(this.state.cid);
    //let canvas = this.props.canvas;
    if (canvas.requestFullScreen) canvas.requestFullScreen();
    else if (canvas.webkitRequestFullScreen) canvas.webkitRequestFullScreen();
    else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
  };

  handleShowHide = () => {
    let canvas = this.state.canvas;
    let formData = {
      fileMenu: false,
      showDownload: false,
    };
    this.props.headerMenu(formData);
    if (this.state.showMainSideBar === false) {
      this.props.mainSideBarState(false);
    } else {
      this.props.mainSideBarState(true);
    }

    this.props.backgroundState(false);
    //this.props.getSelectedType("");
    //this.props.sideBar2(false);
    //console.log(this.state.selectedType);
    /*if (this.state.selectedType == "image" && this.state.cropActive) {
      // console.log("in");
      this.props.cropState(false);
      cancelCrop(canvas);
    }*/
  };

  handleToolBarShowHide = () => {
    let canvas = this.state.canvas;
    /* let activeObject = canvas.getActiveObject();
    var objCheck;
    let allObject = canvas.getObjects();
    if (allObject && allObject.length) {
      allObject.map((obj, id) => {
        if (obj.type == "image" && obj.maskname) {
          if (obj.src || obj) {
            obj.set("selectable", false);
            canvas.bringForward(obj);
          }
        }
      });
    }*/

    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
      //templateChange: true,
    };
    if (this.state.selectedType !== "textbox") {
      // this.props.getSelectedType("");
      this.props.sideBar2(false);
    }
    /* if (this.state.selectedType == "image" && this.state.cropActive) {
      // console.log("in");
      console.log("happy2");
      this.props.cropState(false);
      cancelCrop(canvas);
    }*/

    this.props.toolsMenu(formData);
    this.props.showFilters(false);
    this.props.showAdjustments(false);
    this.props.mainSideBarState(true);
  };

  handleScaleChange = (e) => {
    const sizeData = JSON.parse(sessionStorage.getItem("size"));
    console.log(sizeData);
    let value = e.target.value;
    this.setState({ zoom: e.target.value });
    if (value.length > 10) {
      var newValue = value[6] + value[7] + value[8] + value[9];
    } else {
      var newValue = value[6] + value[7] + value[8];
    }

    /*let formData = {
      width: sizeData.width,
      height: sizeData.height,
      zoomValue: newValue,
    };

    sessionStorage.setItem("size", JSON.stringify(formData));*/
  };

  scaleMyCanvas = (e) => {
    const size = JSON.parse(sessionStorage.getItem("size"));
    let canvas = this.state.canvas;

    let scaleRatio = e.target.value
      ? e.target.value
      : this.state.zoom
      ? this.state.zoom
      : 0.4;

    canvas.setDimensions({
      width: size ? size.width * scaleRatio : this.props.cWidth * scaleRatio,
      height: size ? size.height * scaleRatio : this.props.cHeight * scaleRatio,
    });
    canvas.setZoom(scaleRatio);
    this.setState({ zoom: scaleRatio });
  };

  saveToJson = async () => {
    let canvas = this.state.canvas;
    var json = canvas.toJSON();
    //console.log("saved jason is @@@@", json);
    await json.objects.forEach((element) => {
      //console.log(element);
      if (element.maskname) {
        // console.log(element);
        element.clipTo = null;
        element.fill = null;
      }
    });
    lzwCompress.pack(
      sessionStorage.setItem("J-" + this.state.cid, JSON.stringify(json))
    );
  };

  render() {
    let canvas = this.state.canvas;
    /*let value = this.state.zoom;
    var newValue;
    if (value && value.length > 10) {
      newValue = value[6] + value[7] + value[8] + value[9];
    } else {
      newValue = value[6] + value[7] + value[8];
    }

    console.log(value);*/
    return (
      <div
        className="right-canvas-section"
        onClick={() => this.handleShowHide()}
        id="elem"
      >
        <ToolsHeader
          canvas={canvas}
          fontBold={this.fontBold}
          fontItalic={this.fontItalic}
          deleteSelected={(e) => this.deleteSelected(e)}
          objectSelected={this.state.selectedType}
          activeIndex={this.state.activeObjIndex}
        />
        <WhatsappPlugin name={this.state.name ? this.state.name : ""} />
        <FbPlugin />

        <div className="row" onClick={() => this.handleToolBarShowHide()}>
          <div className="col-md-12 col-sm-12">
            <div className={"canvas-box"} ref={this.myRef} id={this.state.id}>
              <div className="canvas-outer-box">
                <div className="canvas-mid-box">
                  <div className={"canvas-inner-box"} id={"india"}>
                    <div>
                      <canvas id={this.state.cid} ref={this.myRef} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-help">
          <div className="help-box">
            <div className="d-inline percentage-box">
              <ul className="help-btn">
                <li>
                  <div className="zoom-header">
                    <select
                      id="sel"
                      className="select"
                      onChange={(e) => this.scaleMyCanvas(e)}
                      value={this.state.zoom}
                      name="zoom"
                    >
                      <option value="0.1">10%</option>
                      <option value="0.2">20%</option>
                      <option value="0.3">25%</option>
                      <option value="0.4">40%</option>
                      <option value="0.5">50%</option>
                      {<option value="0.6">60%</option>}
                      <option value="0.75">75%</option>
                      <option value="0.85">85%</option>
                      <option value="0.9">90%</option>
                      <option value="1.0">100%</option>
                      {/*  <option value="1.2">120%</option>
                      <option value="1.3">130%</option>*/}
                      <option value={this.state.defaultScale}>Fit</option>
                      {/*<option value="2">Fill</option>*/}
                    </select>
                  </div>
                </li>
                <li>
                  <span className="d-inline resize-box">
                    <img src="/img/resize.png" onClick={this.goFullScreen} />{" "}
                    {/*<img src="img/resize-revert.png" />*/}
                  </span>
                </li>
              </ul>
            </div>
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
    //console.log(data);
    returnState.canvas = data ? data.canvasData : {};
    returnState.canvasBackground = data ? data.backgroundColor : "";
    returnState.imgUrl = data ? data.backgroundImg : "";
    returnState.text = data ? data.Heading : "";
    returnState.textDate = new Date();
    returnState.objType = data ? data.objectType : "";
    returnState.cropActive = data.cropState ? data.cropState : false;
    returnState.cropStateDate = new Date();
    returnState.toolsState = data.toolsState;
    returnState.showMainSideBar = data.mainSidebar;
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setBackground: setBackground,
      emptyData: emptyData,
      getCanvas: getCanvas,
      getSelectedType: getSelectedType,
      activeObjectIndex: activeObjectIndex,
      undoRedo: undoRedo,
      headerMenu: headerMenu,
      sideBar2: sideBar2,
      toolsMenu: toolsMenu,
      showFilters: showFilters,
      showAdjustments: showAdjustments,
      mainSideBarState: mainSideBarState,
      cropState: cropState,
      backgroundState: backgroundState,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Canvas));
