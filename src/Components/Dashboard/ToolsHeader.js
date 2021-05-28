import React, { PureComponent } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import "rc-color-picker/assets/index.css";
import ColorPicker from "rc-color-picker";

import {
  underlineText,
  setTextCase,
  opacity,
  setFontFamily,
  setFontSize,
  setTextAlignment,
  objectType,
  copyObject,
  setLetterSpacing,
  setLetterHeight,
  flipX,
  flipY,
  setObjectToBack,
  setObjectToFront,
  processAlign,
  setTextBackground,
  groupText,
  setShapesColor,
  doneCrop,
  handleCropImage,
  cancelCrop,
  startCrop,
  setShadow,
  removeShadow,
  ungroup,
  lockMe,
  unlockMe,
} from "./Handlers/Handlers.js";
import {
  sideBar2,
  emptyData,
  showFilters,
  showAdjustments,
  getSelectedType,
  toolsMenu,
  mainSideBarState,
  cropState,
  getCanvas,
  isVolume,
} from "../../Actions/canvasActions.js";

class ToolsHeader extends PureComponent {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("useMe"));
    const canvasId = localStorage.getItem("canvasId");
    this.state = {
      cg: this.props.match.params.cg ? this.props.match.params.cg : "",
      showOpacity: false,
      opacity: 100,
      colorDisplay: "white",
      underline: true,
      fontSize: 60,
      fontFamily: "arial",
      canvasDetails: "",
      align: "left",
      alignPic: "img/align-left.png",
      fontCase: true,
      show2ndSideBar: false,
      showFilters: false,
      lineSpace: 0,
      lineHeight: 1.6,
      showLine: false,
      showFlip: false,
      objectType: "",
      moveFlipX: true,
      moveFlipY: true,
      showAdjust: false,
      showPositionDropdown: false,
      activeIndex: -1,
      textBackgroundColor: "#fff",
      userEmail: user ? user.email : "",
      cropActive: false,
      canvasId: canvasId ? canvasId : "",
      toolsState: {},
      giphy: false,
      templateChange: false,
      cropComplete: false,
      objectArray: 0,
      isShadow: false,
      isVideo: false,
      volume: false,
      volumeChanged: false,
      videoPlay: false,
      grouping: false,
      locking: false,
      objLength: 0,
      canvasObjLen: 0,
      showGTools: false,
      showMaskState: false,
      isMask: false,
    };
  }

  componentDidMount() {}

  handleChangeStart = () => {
    //console.log("Change event started");
  };

  handleChangeOpcaity = (value) => {
    let canvas = this.props.canvas;
    if (value == 0 || value == 1) {
      opacity(canvas, 1);
    } else {
      opacity(canvas, value);
    }
    this.setState({
      opacity: value,
    });
    setTimeout(() => {
      this.props.getCanvas(canvas);
    }, 500);
  };

  handleChangeLineHeight = (value) => {
    let canvas = this.props.canvas;
    setLetterHeight(canvas, value);
    this.setState({
      lineHeight: value,
    });
  };

  handleChangeLineSpace = (value) => {
    let canvas = this.props.canvas;
    setLetterSpacing(canvas, value);
    this.setState({
      lineSpace: value,
    });
  };

  handleInputChange = (event) => {
    let canvas = this.props.canvas;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (target.name == "opacity") {
      opacity(canvas, value);
    }
    if (target.name == "lineSpace") {
      setLetterSpacing(canvas, value);
    }
    if (target.name == "lineHeight") {
      setLetterHeight(canvas, value);
    }

    if (event.target.name === "fontFamily") {
      setFontFamily(this.props.canvas, value);
    }
    if (event.target.name === "fontSize") {
      setFontSize(this.props.canvas, value);
    }

    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    let canvas;
    if (
      props.canvasDetails !== undefined &&
      props.canvasDetails !== state.canvasDetails
    ) {
      canvas = props.canvasDetails ? props.canvasDetails : "";
      if (canvas && canvas.ungroupState) {
        //console.log(canvas.ungroupState);
        returnState.showGTools =
          canvas.ungroupState == "ungroup" ? true : false;
      }
      returnState.canvas = props.canvasDetails;
      let activeObjData = returnState.canvas
        ? returnState.canvas.getActiveObject()
        : "";

      if (
        activeObjData &&
        activeObjData._objects &&
        activeObjData._objects.length
      ) {
        returnState.objLength = activeObjData._objects.length;
      }
      if (activeObjData) {
        if (activeObjData.locked) {
          lockMe(returnState.canvas);
        }
        // console.log(activeObjData);
        if (activeObjData && activeObjData.maskname && activeObjData.isShape) {
          returnState.showMaskState = true;
        } else if (activeObjData && activeObjData.myImage) {
          returnState.showMaskState = true;
        } else {
          returnState.showMaskState = false;
        }

        if (activeObjData.locked == true) {
          returnState.locking = true;
        } else {
          returnState.locking = false;
        }
        if (activeObjData.video_src) {
          returnState.isVideo = true;
        } else {
          returnState.isVideo = false;
        }
        returnState.giphy = activeObjData.imageType ? true : false;
      }
      let areObjects = canvas.toObject();
      if (areObjects && areObjects.objects && areObjects.objects.length) {
        areObjects.objects.map((obj, id) => {
          if (obj.type == "image" && obj.maskname) {
            returnState.isMask = true;
          }
        });
      }

      if (areObjects && areObjects.length <= 0) {
        returnState.objectType = "";
      }
      if (areObjects && areObjects.length > 1) {
      }
      let activeIndex = props.activeIndex;
      let videoId = activeObjData ? activeObjData.videoId : "";

      if (returnState.activeIndex !== props.activeIndex) {
        returnState.activeIndex = props.activeIndex;
      }
      if (activeIndex > -1 && !state.showPositionDropdown) {
        let objectData = canvas.toObject();

        let objectList = objectData.objects;
        //console.log(objectList);

        objectList.map((obj, id) => {
          if (id === activeIndex) {
            if (videoId && videoId == obj.videoId) {
              returnState.volume = obj.videoVolume; // video volume State
            }
            //console.log(obj);

            returnState.fontSize = obj.fontSize;
            returnState.fontFamily = obj.fontFamily;
            returnState.grouping = obj.type == "group" ? true : false;

            //console.log(obj.fontFamily);
            returnState.textBackgroundColor = obj.backgroundColor
              ? obj.backgroundColor
              : "#fff";

            returnState.align = obj.textAlign;
            if (returnState.align) {
              if (returnState.align == "left") {
                returnState.alignPic = "img/align-left.png";
              }
              if (returnState.align == "center") {
                returnState.alignPic = "img/align-center.png";
              }
              if (returnState.align == "right") {
                returnState.alignPic = "img/align-right.png";
              }
            }
            returnState.lineSpace = obj.charSpacing;
            returnState.lineHeight = obj.lineHeight;
            returnState.opacity = obj.opacity * 100;

            if (
              (obj.type == "rect" && obj.fill !== undefined) ||
              (obj.type == "circle" && obj.fill !== undefined) ||
              obj.type == "triangle" ||
              (obj.type == "polygon" && obj.fill !== undefined) ||
              obj.type == "ellipse"
            ) {
              returnState.textBackgroundColor = obj ? obj.fill : "#d1d1d1";
            }
            if (obj && obj.type == "line") {
              returnState.textBackgroundColor = obj ? obj.fill : "#696969";
            }
            if (obj && obj.type == "rect" && obj.fill == "" && obj.stroke) {
              returnState.textBackgroundColor = obj ? obj.stroke : "#d1d1d1";
              returnState.objectType = "sFrame";
            }
            if (obj && obj.type == "polygon" && obj.fill == "" && obj.stroke) {
              returnState.textBackgroundColor = obj ? obj.stroke : "#d1d1d1";
              returnState.objectType = "polyFrame";
            }
            if (obj && obj.type == "circle" && obj.fill == "" && obj.stroke) {
              returnState.textBackgroundColor = obj ? obj.stroke : "#d1d1d1";
              returnState.objectType = "circleFrame";
            }
          }
        });
      }
      returnState.objectArray = returnState.canvas.getObjects().length;
    }
    if (props.show2ndSideBar !== undefined && props.show2ndSideBar !== "") {
      returnState.show2ndSideBar = props.show2ndSideBar;
    }
    if (props.showAdjust !== undefined && props.showAdjust !== "") {
      returnState.showAdjust = props.showAdjust;
      if (
        props.showAdjust === false &&
        state.showFilters == false &&
        state.showMainSideBar == false
      ) {
        // props.mainSideBarState(true);
      }
    }
    if (props.filters !== undefined && props.filters !== state.filters) {
      returnState.showFilters = props.filters;
    }
    if (
      props.objectType !== undefined &&
      props.objectType !== state.objectType &&
      props.objDate !== state.objDate
    ) {
      returnState.objDate = props.objDate;
      let objectData = canvas.getActiveObject();
      if (
        objectData &&
        objectData.type == "rect" &&
        objectData.fill == "" &&
        objectData.stroke
      ) {
        returnState.objectType = "sFrame";
      } else if (
        objectData &&
        objectData.type == "polygon" &&
        objectData.fill == "" &&
        objectData.stroke
      ) {
        returnState.objectType = "polyFrame";
      } else if (
        objectData &&
        objectData.type == "circle" &&
        objectData.fill == "" &&
        objectData.stroke
      ) {
        returnState.objectType = "circleFrame";
      } else {
        returnState.objectType = props.objectType;
      }
      //  returnState.showPositionDropdown = false;
      if (returnState.objectType == "textbox" || returnState.objectType == "") {
        cancelCrop(returnState.canvas);
        returnState.showFlip = false;
        returnState.cropActive = false;
      }
      if (returnState.objectType == "image" || returnState.objectType == "") {
        returnState.showLine = false;
        returnState.templateChange = false;
      }
    }

    if (
      props.toolsState !== undefined &&
      props.toolsState !== state.toolsState
    ) {
      returnState.toolsState = props.toolsState;
      returnState.showOpacity = props.toolsState
        ? props.toolsState.showOpacity
        : false;
      returnState.showPositionDropdown = props.toolsState
        ? props.toolsState.showPositionDropdown
        : false;

      returnState.showLine = props.toolsState
        ? props.toolsState.showLine
        : false;
      returnState.showFlip = props.toolsState
        ? props.toolsState.showFlip
        : false;
      returnState.templateChange = props.toolsState
        ? props.toolsState.templateChange
        : false;
      /* if (props.toolsState.grouping) {
        //console.log(props.toolsState.grouping);
        returnState.grouping = props.toolsState
          ? props.toolsState.grouping
          : false;
      }*/
    }
    if (
      props.cropActive !== undefined &&
      props.cropActive !== "" &&
      props.cropActive !== state.cropActive &&
      props.cropStateDate !== state.cropStateDate
    ) {
      //props.getSelectedType("image");
      returnState.cropActive = props.cropActive;
      returnState.cropStateDate = props.cropStateDate;
    }
    /*if (
      props.volume !== undefined &&
      props.volume !== state.volume &&
      props.volumeChanged == true &&
      props.volumeDate !== state.volumeDate
    ) {
      let canvas = returnState.canvas;
      let obj = canvas.getObjects();
      if (obj && obj.length) {
        obj.map((obj, id) => {
          if (obj.videoVolume) {
            obj.set("videoVolume", true);
          }
        });
      }
      console.log("lol");
      //returnState.volumeDate = props.volumeDate;
      //returnState.volume = props.volume;
    }*/
    if (
      props.showMainSideBar !== undefined &&
      props.showMainSideBar !== state.showMainSideBar
    ) {
      returnState.showMainSideBar = props.showMainSideBar;
    }
    return returnState;
  }

  componentDidUpdate(prevProps, prevState) {
    let canvas = this.props.canvas;
    let activeIndex = this.props.activeIndex;

    if (activeIndex > -1) {
      let objectData = canvas.toObject();
      let objectList = objectData;
    }

    /*canvas.on("object:selected", (options) => {
      //this.props.getSelectedType(canvas.getActiveObject().type);
      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().type == "textbox"
      ) {
        this.props.getSelectedType("textbox");
      }

      if (
        canvas.getActiveObject() &&
        canvas.getActiveObject().type == "image"
      ) {
        this.props.getSelectedType("image");
      }
    });*/
  }
  handleChangeComplete = () => {
    // console.log("Change event completed");
  };

  /*shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.objectType == this.state.objectType) {
      return false;
    } else {
      return true;
    }
  }*/

  showOpacityTool = () => {
    this.setState({
      showOpacity: !this.state.showOpacity,
      showPositionDropdown: false,
      showFlip: false,
    });
    setTimeout(() => {
      let formData = {
        showOpacity: this.state.showOpacity,
        showPositionDropdown: false,
        showFlip: false,
      };

      this.props.toolsMenu(formData);
    }, 0);
  };

  setUnderline = () => {
    this.setState({ underline: !this.state.underline });
    let canvas = this.props.canvas;
    setTimeout(() => {
      let value = !this.state.underline;
      underlineText(canvas, value);
    }, 0);
  };

  fontCase = () => {
    let canvas = this.props.canvas;
    this.setState({ fontCase: !this.state.fontCase });

    setTimeout(() => {
      let value = this.state.fontCase;
      setTextCase(canvas, value);
    }, 0);
  };

  textAlign = () => {
    let canvas = this.props.canvas;
    let currentAlign = this.state.align;
    let value = "left";
    if (currentAlign == "left") {
      value = "center";
      this.setState({
        align: "center",
        alignPic: "img/align-center.png",
        fontSize: 60,
      });
    }
    if (currentAlign == "center") {
      value = "right";
      this.setState({
        align: "right",
        alignPic: "img/align-right.png",
        fontSize: 45,
      });
    }
    if (currentAlign == "right") {
      value = "left";
      this.setState({
        align: "left",
        alignPic: "img/align-left.png",
        fontSize: 35,
      });
    }
    setTextAlignment(canvas, value);
  };

  show2ndModal = () => {
    this.props.emptyData();
    let value = this.state.show2ndSideBar;
    if (this.state.show2ndSideBar == true) {
      this.props.mainSideBarState(true);
    } else {
      this.props.mainSideBarState(false);
    }
    this.props.showAdjustments(false);

    this.props.showFilters(false);
    if (value) this.props.sideBar2(false);
    if (!value) this.props.sideBar2(true);
  };

  showFiltersModal = () => {
    this.props.emptyData();
    let value = this.state.showFilters;
    if (this.state.showFilters == false) {
      this.props.mainSideBarState(true);
    } else {
      this.props.mainSideBarState(false);
    }
    if (value) this.props.showFilters(false);
    if (!value) this.props.showFilters(true);
    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
    };
    this.props.showAdjustments(false);
    this.props.sideBar2(false);
    //this.props.mainSideBarState(false);
    this.props.toolsMenu(formData);
  };

  cloneMe = () => {
    let canvas = this.props.canvas;
    copyObject(canvas);
  };

  showLineModal = () => {
    this.setState({ showLine: !this.state.showLine });
    this.setState({
      showFlip: false,

      showOpacity: false,
      showPositionDropdown: false,
    });
    setTimeout(() => {
      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: this.state.showLine,
        showFlip: false,
      };
      this.props.toolsMenu(formData);
    }, 0);
  };

  handleShowFlip = () => {
    this.setState({
      showFlip: !this.state.showFlip,
      showLine: false,
      showOpacity: false,
      showPositionDropdown: false,
    });
    setTimeout(() => {
      let formData = {
        showOpacity: this.state.showOpacity,
        showPositionDropdown: false,
        showLine: false,
        showFlip: this.state.showFlip,
      };
      this.props.showAdjustments(false);
      this.props.showFilters(false);
      this.props.toolsMenu(formData);
    }, 0);
  };

  doFlipX = () => {
    let canvas = this.props.canvas;
    let value = this.state.moveFlipX;
    flipX(canvas, value);
    this.setState({ moveFlipX: !this.state.moveFlipX });
  };

  doFlipY = () => {
    let canvas = this.props.canvas;
    let value = this.state.moveFlipY;
    flipY(canvas, value);
    this.setState({ moveFlipY: !this.state.moveFlipY });
  };

  swicthToAdjust = () => {
    let value = this.state.showAdjust;
    if (!value) {
      this.props.mainSideBarState(false);
    } else {
      this.props.mainSideBarState(true);
    }
    this.props.showFilters(false);
    if (value) this.props.showAdjustments(false);
    if (!value) this.props.showAdjustments(true);
    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
    };

    this.props.toolsMenu(formData);
  };

  handlePosition = (value) => {
    let category = this.state.cg;
    let activeObj;
    // console.log(value);
    let canvas = this.props.canvas;

    if (value == "front") {
      setObjectToFront(canvas);
    } else if (value == "back") {
      setObjectToBack(canvas);
    } else {
      processAlign(value, canvas, category);
    }
  };

  handlePositionDropdown = () => {
    // console.log("in");
    let canvas = this.props.canvas;
    this.setState({
      showPositionDropdown: !this.state.showPositionDropdown,
      showLine: false,
      showOpacity: false,
      showFlip: false,
    });
    setTimeout(() => {
      let formData = {
        showOpacity: false,
        showPositionDropdown: this.state.showPositionDropdown,
        showLine: false,
        showFlip: false,
      };

      this.props.toolsMenu(formData);
      this.props.getCanvas(canvas);
    }, 0);
  };
  changeHandler = (colors) => {
    let canvas = this.props.canvas;
    if (this.state.objectType == "textbox") {
      setTextBackground(canvas, colors.color);
    }

    if (
      this.state.objectType == "circle" ||
      this.state.objectType == "rect" ||
      this.state.objectType == "line" ||
      this.state.objectType == "triangle" ||
      this.state.objectType == "polygon" ||
      this.state.objectType == "ellipse"
    ) {
      setShapesColor(canvas, colors.color, this.state.objectType);
    }
    if (this.state.objectType == "sFrame") {
      setShapesColor(canvas, colors.color, this.state.objectType);
    }
    if (this.state.objectType == "polyFrame") {
      setShapesColor(canvas, colors.color, this.state.objectType);
    }
    if (this.state.objectType == "circleFrame") {
      setShapesColor(canvas, colors.color, this.state.objectType);
    }
  };

  closeHandler = (colors) => {
    //console.log(colors);
  };
  handleTextBackground() {}

  handleCrop = () => {
    let count = 0;
    let canvas = this.props.canvas;
    if (canvas) {
      let activeObject = canvas.getActiveObject();

      if (activeObject) {
        canvas.bringToFront(activeObject);
        activeObject.set("angle", 0);
        activeObject.setCoords();
        //canvas.renderAll();
      }
    }
    let objectArray = canvas.getObjects();
    objectArray.map((obj, id) => {
      if (obj.type == "image") {
        count++;
      }
    });
    canvas.renderAll();
    if (count > 0) {
      this.setState({ cropActive: true });
      handleCropImage(canvas);
      this.props.showAdjustments(false);
      this.props.showFilters(false);
      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: false,
        showFlip: false,
      };
      this.props.cropState(true);
      this.props.toolsMenu(formData);
    }
  };

  dismissCrop = () => {
    let canvas = this.props.canvas;
    this.props.getSelectedType("image");
    cancelCrop(canvas);
    this.setState({
      cropActive: false,
      objectType: "image",
      //templateChange: true,
    });

    /*if (canvas) {
      let activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.sendToBack(activeObject);
        //canvas.renderAll();
      }
    }*/

    this.props.emptyData();
    //handleCropImage();
    this.props.cropState(false);
  };

  finishCrop = () => {
    let canvas = this.props.canvas;
    doneCrop(canvas);
    let obj = canvas.getObjects();
    if (obj) {
      obj.map((objx, idx) => {
        if (objx.fill == "rgba(0, 0, 0, 0.3)") {
          canvas.remove(objx);
        }
      });
    }

    this.setState({
      cropActive: false,
      objectType: "image",
      cropComplete: true,
      templateChange: false,
    });
    //this.props.getCanvas(canvas);
    this.props.cropState(false);
    this.props.getSelectedType("image");
    // this.props.getSelectedType("image");
  };

  addShadow = (val) => {
    let canvas = this.props.canvas;
    if (!this.state.isShadow) {
      setShadow(canvas);
      this.setState({ isShadow: true });
    }
    if (this.state.isShadow) {
      removeShadow(canvas);
      this.setState({ isShadow: false });
    }
  };

  handleVolume = (value) => {
    this.setState({ volume: !this.state.volume });
    let canvas = this.props.canvas;
    let activeObj = canvas.getActiveObject();
    if (activeObj) {
      let videoId = activeObj.videoId;
      var vid = document.getElementById(videoId);
      //console.log(this.state.volume);
      vid.muted = this.state.volume;
      activeObj.set("videoVolume", value);
      //  this.props.isVolume(value);
    }
  };

  handlePlay = (value) => {
    console.log(value);
    this.setState({ videoPlay: !this.state.videoPlay });
    let canvas = this.props.canvas;
    let activeObj = canvas.getActiveObject();
    if (activeObj) {
      let videoId = activeObj.videoId;
      var vid = document.getElementById(videoId);
      // vid.muted = this.state.volume;
      if (value == false) {
        vid.pause();
      } else {
        vid.play();
      }
      //activeObj.set("videoVolume", value);

      //  this.props.isVolume(value);
    }
  };

  groupItems = () => {
    let canvas = this.props.canvas;
    groupText(canvas);
    this.setState({ grouping: true });
    this.props.getSelectedType("group");
  };

  ungroupItems = () => {
    let canvas = this.props.canvas;
    ungroup(canvas);
    this.setState({ grouping: false });
  };

  lockObject = () => {
    console.log("inside");
    let canvas = this.props.canvas;
    lockMe(canvas);
    if (canvas.getActiveObject()) this.setState({ locking: true });
    // this.props.getSelectedType("");
  };

  unlockObject = () => {
    let canvas = this.props.canvas;
    unlockMe(canvas);
    if (canvas.getActiveObject()) this.setState({ locking: false });
    //this.props.getSelectedType("image");
  };

  render() {
    let canvas = this.props.canvas;
    //console.log(this.state.locking);
    // console.log(this.state.objectType);
    //console.log(this.state.showPositionDropdown);
    //console.log(this.state.cropActive);
    let transValue = Math.round(this.state.opacity);
    if (this.props.canvas) {
      let canva = this.props.canvas;
    }
    let lHeight = this.state.lineHeight ? this.state.lineHeight.toFixed(2) : 0;
    //console.log(this.state.showMaskState);
    return (
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="canvas-header">
            {!this.state.templateChange && (
              <div
                className={
                  this.state.locking ? "noDisplay" : "canvas-left-header"
                }
              >
                <ul className="effects-ul">
                  {/* <li class="color-patches">
                    <span style={{ background: "red" }}></span>
                  </li>*/}
                  {(this.state.objectType == "image" ||
                    this.state.objectType == "giphy") && (
                    <li
                      className={
                        this.state.cropActive || this.state.isVideo
                          ? "noDisplay"
                          : ""
                      }
                      onClick={this.showFiltersModal}
                    >
                      Filters
                    </li>
                  )}
                  {(this.state.objectType == "image" ||
                    this.state.objectType == "giphy") && (
                    <li
                      className={
                        this.state.cropActive || this.state.isVideo
                          ? "noDisplay"
                          : ""
                      }
                      onClick={this.swicthToAdjust}
                    >
                      Adjust
                    </li>
                  )}
                  {this.state.objectType == "image" && !this.state.giphy && (
                    <li
                      className={
                        this.state.cropActive ||
                        this.state.isVideo ||
                        this.state.showMaskState
                          ? "noDisplay"
                          : ""
                      }
                      onClick={this.handleCrop}
                    >
                      Crop
                    </li>
                  )}
                  {(this.state.objectType == "rect" ||
                    this.state.objectType === "image") &&
                    this.state.cropActive && (
                      <li
                        className={
                          !this.state.cropActive ? "noDisplay" : "close-li"
                        }
                        onClick={this.dismissCrop}
                      >
                        <img src="/img/close.png" />
                        Cancel
                      </li>
                    )}

                  {(this.state.objectType == "rect" ||
                    this.state.objectType === "image") &&
                    this.state.cropActive && (
                      <li
                        className={
                          !this.state.cropActive ? "noDisplay" : "tick-li"
                        }
                        onClick={this.finishCrop}
                      >
                        <img src="/img/tick.png" />
                        Done
                      </li>
                    )}

                  {(this.state.objectType == "image" ||
                    this.state.objectType == "giphy") && (
                    <li className={this.state.cropActive ? "noDisplay" : ""}>
                      <a onClick={this.handleShowFlip}> Flip</a>

                      {this.state.showFlip && (
                        <ul className={"flip-ul"}>
                          <li onClick={this.doFlipY}>
                            <img src="/img/v-flip.png" /> Flip Vertical
                          </li>
                          <li onClick={this.doFlipX}>
                            <img src="/img/h-flip.png" /> Flip Horizontal
                          </li>
                        </ul>
                      )}
                    </li>
                  )}
                </ul>

                <ul className="">
                  {(this.state.objectType &&
                    this.state.objectType == "textbox") ||
                    (this.state.objectType.length == 4 && (
                      <li
                        className={
                          this.state.cropComplete || this.state.showMaskState
                            ? "noDisplay"
                            : "color-patches"
                        }
                      >
                        {/*<span style={{ background: "red" }}></span>
                    <img src="img/colorwheel.webp" />*/}
                        {!this.state.cropActive &&
                          this.state.objectType !== "image" && (
                            <ColorPicker
                              color={this.state.textBackgroundColor}
                              alpha={100}
                              onChange={this.changeHandler}
                              placement="bottomLeft"
                            />
                          )}
                      </li>
                    ))}
                  {this.state.objectType && this.state.objectType.length > 5 && (
                    <li
                      className={
                        this.state.cropActive || this.state.showMaskState
                          ? "noDisplay"
                          : "color-patches"
                      }
                    >
                      {/*<span style={{ background: "red" }}></span>
                    <img src="img/colorwheel.webp" />*/}
                      <ColorPicker
                        color={this.state.textBackgroundColor}
                        alpha={100}
                        onChange={this.changeHandler}
                        placement="bottomLeft"
                      />
                    </li>
                  )}
                  <li
                    className={
                      this.state.objectType == "textbox" &&
                      this.state.locking == false
                        ? "font-family"
                        : "noDisplay"
                    }
                  >
                    <select
                      value={this.state.fontFamily}
                      onChange={this.handleInputChange}
                      name="fontFamily"
                      className={
                        this.state.objectType == "textbox" ? "" : "noDisplay"
                      }
                    >
                      <option value="arial">Arial</option>
                      <option value="arial black">Arial Black</option>
                      <option value="Bookman">Bookman</option>
                      <option value="Caveat">Caveat</option>
                      <option value="comic sans ms">Comic Sans MS</option>
                      <option value="Concert One">Concert One</option>
                      <option value="courier">Courier</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Dancing Script">Dancing Script</option>
                      <option value="engagement">Engagement</option>
                      <option value="georgia">Georgia</option>
                      {/*<option value="Great Vibes">Great Vibes</option>*/}
                      <option value="Grenze Gotisch">Grenze Gotisch</option>
                      <option value="helvetica">Helvetica</option>
                      <option value="hoefler text">Hoefler Text</option>
                      <option value="impact">Impact</option>
                      <option value="Indie Flower">Indie Flower</option>
                      <option value="Lexend Zetta">Lexend Zetta</option>
                      <option value="Lobster">Lobster</option>
                      <option value="Modak">Modak</option>
                      <option value="monaco">Monaco</option>
                      <option value="monospace">Monospace</option>
                      <option value="optima">Optima</option>
                      <option value="palatino">palatino</option>
                      <option value="Raleway">Raleway</option>
                      <option value="Source Sans Pro">Source Sans Pro</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Ultra">Ultra</option>
                      <option value="verdana">Verdana</option>
                    </select>
                  </li>
                  {this.state.objectType == "textbox" && (
                    <li className="font-size">
                      <select
                        value={this.state.fontSize}
                        onChange={this.handleInputChange}
                        name="fontSize"
                      >
                        <option value="20">6</option>
                        <option value="25">8</option>
                        <option value="35">10</option>
                        <option value="40">12</option>
                        <option value="55">14</option>
                        <option value="70">18</option>
                        <option value="80">20</option>
                        <option value="90">22</option>
                        <option value="100">24</option>
                        <option value="110">27</option>
                        <option value="120">30</option>
                        <option value="130">33</option>
                        <option value="140">36</option>
                        <option value="145">39</option>
                        <option value="150">42</option>
                        <option value="155">46</option>
                        <option value="160">60</option>
                      </select>
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li className="font-color" onClick={this.show2ndModal}>
                      <span className="d-block">
                        <img src="/img/text-color.png" />
                      </span>
                      <span
                        className="d-block color-change"
                        style={{ background: this.state.colorDisplay }}
                      ></span>
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="bold"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Bold"
                      onClick={() => this.props.fontBold()}
                    >
                      <img src="/img/bold.png" />
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="italic"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Italic"
                      onClick={() => this.props.fontItalic()}
                    >
                      <img src="/img/italic.png" />
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="underline"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Underline"
                    >
                      <img
                        src="/img/underline.png"
                        onClick={this.setUnderline}
                      />
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="align"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Align"
                      onClick={this.textAlign}
                    >
                      <img src={"/" + this.state.alignPic} />
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="uppercase"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Uppercase"
                    >
                      <img src="/img/uppercase.png" onClick={this.fontCase} />
                    </li>
                  )}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="uppercase"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Shadow"
                    >
                      <img src="/img/shadow.png" onClick={this.addShadow} />
                    </li>
                  )}
                  {/*
                  <li
                    class="list"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="List"
                  >
                    <img src="img/list.png" />
                  </li>
                */}
                  {this.state.objectType == "textbox" && (
                    <li
                      className="spacing"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Spacing"
                    >
                      <img
                        src="/img/spacing.png"
                        onClick={this.showLineModal}
                      />
                      {this.state.showLine && (
                        <ul className="spacing-ul">
                          <li className="w-100">
                            <span className="d-inline">{"Letter Spacing"}</span>
                            <span className="d-inline rang-span">
                              <Slider
                                min={-200}
                                max={800}
                                value={this.state.lineSpace}
                                onChangeStart={this.handleChangeStart}
                                onChange={this.handleChangeLineSpace}
                                onChangeComplete={this.handleChangeComplete}
                                tooltip={false}
                              />
                            </span>
                            <span className="range-input">
                              <input
                                type="text"
                                placeholder="--"
                                value={this.state.lineSpace}
                                onChange={this.handleInputChange}
                                name="lineSpace"
                                disabled
                              />
                            </span>
                          </li>
                          <li className="w-100">
                            <span className="d-inline">Line Height</span>
                            <span className="d-inline rang-span">
                              <Slider
                                min={0}
                                max={2.5}
                                step={0.1}
                                value={this.state.lineHeight}
                                onChangeStart={this.handleChangeStart}
                                onChange={this.handleChangeLineHeight}
                                onChangeComplete={this.handleChangeComplete}
                                tooltip={false}
                              />
                            </span>
                            <span className="range-input">
                              <input
                                type="text"
                                placeholder="--"
                                value={lHeight}
                                onChange={this.handleInputChange}
                                name={"lineHeight"}
                                disabled
                              />
                            </span>
                          </li>
                        </ul>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            )}
            {!this.state.templateChange && (
              <div
                className={
                  this.state.cropActive ? "noDisplay" : "canvas-right-header"
                }
              >
                {this.state.objectType == "" && <ul></ul>}

                {!this.state.objectType == "" && (
                  <ul className="">
                    {!this.state.grouping && !this.state.showGTools && (
                      <li
                        className={
                          this.state.locking ||
                          this.state.objectArray <= 1 ||
                          this.state.showMaskState ||
                          this.state.isMask
                            ? "noDisplay"
                            : "ungroup"
                        }
                        onClick={() => {
                          this.groupItems();
                        }}
                      >
                        Group
                      </li>
                    )}

                    {this.state.grouping && !this.state.showGTools && (
                      <li
                        className={
                          this.state.locking ||
                          this.state.objLength > 10 ||
                          this.state.showMaskState ||
                          this.state.isMask
                            ? "noDisplay"
                            : "ungroup"
                        }
                        onClick={() => {
                          this.ungroupItems();
                        }}
                      >
                        Ungroup
                      </li>
                    )}
                    {this.state.volume && (
                      <li
                        className={this.state.isVideo ? "" : "noDisplay"}
                        onClick={() => {
                          this.handleVolume(false);
                        }}
                      >
                        <i
                          class="fa fa-volume-up faSize"
                          aria-hidden="true"
                        ></i>
                      </li>
                    )}

                    {!this.state.volume && (
                      <li
                        className={this.state.isVideo ? "" : "noDisplay"}
                        onClick={() => {
                          this.handleVolume(true);
                        }}
                      >
                        <i
                          class="fa fa-volume-off faSize"
                          aria-hidden="true"
                        ></i>
                      </li>
                    )}

                    {/* {this.state.videoPlay && (
                      <li
                        className={this.state.isVideo ? "" : "noDisplay"}
                        onClick={() => {
                          this.handlePlay(true);
                        }}
                      >
                        <i class="fa fa-play faSize" aria-hidden="true"></i>
                      </li>
                    )}

                    {!this.state.videoPlay && (
                      <li
                        className={this.state.isVideo ? "" : "noDisplay"}
                        onClick={() => {
                          this.handlePlay(false);
                        }}
                      >
                        <i class="fa fa-pause faSize" aria-hidden="true"></i>
                      </li>
                    )}*/}

                    <li
                      className={
                        this.state.objectType == "group" ||
                        this.state.locking ||
                        this.state.showGTools
                          ? "noDisplay"
                          : "position"
                      }
                    >
                      <a className="" onClick={this.handlePositionDropdown}>
                        Position
                      </a>
                      {this.state.showPositionDropdown && (
                        <ul className="position-ul">
                          <li
                            onClick={() => {
                              this.handlePosition(
                                this.state.objectArray >= 2 ? "front" : ""
                              );
                            }}
                            className={
                              this.state.objectArray >= 2
                                ? ""
                                : "disabled-file-menu"
                            }
                          >
                            <img src="/img/forwards.png" />
                            &nbsp; Forwards
                          </li>
                          <li
                            onClick={() => {
                              this.handlePosition(
                                this.state.objectArray >= 2 ? "back" : ""
                              );
                            }}
                            className={
                              this.state.objectArray >= 2
                                ? ""
                                : "disabled-file-menu"
                            }
                          >
                            <img src="/img/backwards.png" />
                            &nbsp; Backwards
                          </li>
                          {/*<li>
                        <img src="img/forwards.png" />
                        &nbsp; To front
                      </li>
                      <li>
                        <img src="img/backwards.png" />
                        &nbsp; To back
                      </li>*/}
                          <li className="align-page">Align to page</li>
                          <li
                            onClick={() => {
                              this.handlePosition("top");
                            }}
                          >
                            <img src="/img/top.png" />
                            &nbsp; Top
                          </li>
                          <li
                            onClick={() => {
                              this.handlePosition("left");
                            }}
                          >
                            <img src="/img/left.png" />
                            &nbsp; Left
                          </li>
                          {
                            <li
                              onClick={() => {
                                this.handlePosition("middle");
                              }}
                            >
                              <img src="/img/middle.png" />
                              &nbsp; Middle
                            </li>
                          }
                          <li
                            onClick={() => {
                              this.handlePosition("center");
                            }}
                          >
                            <img src="/img/center.png" />
                            &nbsp; Center
                          </li>
                          <li
                            onClick={() => {
                              this.handlePosition("bottom");
                            }}
                          >
                            <img src="/img/bottom.png" />
                            &nbsp; Bottom
                          </li>
                          <li
                            onClick={() => {
                              this.handlePosition("right");
                            }}
                          >
                            <img src="/img/right.png" />
                            &nbsp; Right
                          </li>
                        </ul>
                      )}
                    </li>
                    {/*this.props.objectSelected == "textbox" &&
                    
                      <li
                      class="copy-style"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Copy"
                    >
                      <img src="img/copy.png" />
                    </li>
                    */}
                    <li
                      className={
                        this.state.locking || this.state.showGTools
                          ? "noDisplay"
                          : "transparency"
                      }
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Transparency"
                    >
                      <img
                        src="/img/transparency.png"
                        title="transparency"
                        onClick={this.showOpacityTool}
                      />
                      {this.state.showOpacity && (
                        <ul className={"transparency-dropdown"}>
                          <li>
                            <span className="d-inline">Transparency</span>
                            <span className="d-inline rang-span">
                              <Slider
                                min={10}
                                max={100}
                                value={this.state.opacity}
                                onChangeStart={this.handleChangeStart}
                                onChange={this.handleChangeOpcaity}
                                onChangeComplete={this.handleChangeComplete}
                                tooltip={false}
                                name="opacity"
                              />
                            </span>
                            <span className="range-input">
                              <input
                                type="text"
                                placeholder="--"
                                value={transValue}
                                onChange={this.handleInputChange}
                                name="opacity"
                                disabled
                              />
                            </span>
                          </li>
                        </ul>
                      )}
                    </li>
                    {/*<li
                    class="link"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Link"
                  >
                    <img src="img/link.png" />
                  </li>*/}

                    {this.state.locking &&
                      !this.state.grouping &&
                      !this.state.showGTools && (
                        <li
                          className={
                            this.state.objectType == "group" &&
                            !this.state.grouping
                              ? "noDisplay"
                              : "lock"
                          }
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Lock"
                          onClick={() => this.unlockObject()}
                        >
                          {<i class="fa fa-lock" aria-hidden="true"></i>}
                          {/* <img
                          src="./img/unlock.png"
                          style={{ display: "none" }}
                        />
                        <img src="/img/lock.png" style={{ display: "none" }} />*/}
                        </li>
                      )}
                    {!this.state.locking &&
                      !this.state.grouping &&
                      !this.state.showGTools && (
                        <li
                          className={
                            this.state.objectType == "group" &&
                            !this.state.grouping
                              ? "noDisplay"
                              : "lock"
                          }
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Lock"
                          onClick={() => this.lockObject()}
                        >
                          {/* <img
                          src="./img/unlock.png"
                          style={{ display: "none" }}
                        />
                        <img src="/img/lock.png" style={{ display: "none" }} />*/}
                          {<i class="fa fa-unlock" aria-hidden="true"></i>}
                        </li>
                      )}

                    {!this.state.isVideo && !this.state.showGTools && (
                      <li
                        className={
                          this.state.locking || this.state.showMaskState
                            ? "noDisplay"
                            : "duplicate"
                        }
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Duplicate"
                      >
                        <img src="/img/duplicate.png" onClick={this.cloneMe} />
                      </li>
                    )}
                    <li
                      className={this.state.showGTools ? "noDisplay" : "delete"}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Delete"
                      onClick={(e) => this.props.deleteSelected(e)}
                    >
                      <img src="/img/delete.png" />
                    </li>
                  </ul>
                )}
              </div>
            )}
            <div className="canvas-right-header"></div>
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
    returnState.canvasDetails = data.canvasData;
    returnState.show2ndSideBar = data.showSidebar2;
    returnState.filters = data.filters;
    returnState.objectType = data.objectType;
    returnState.objDate = new Date();
    returnState.showAdjust = data.showAdjust;
    returnState.toolsState = data.toolsState;
    returnState.cropActive = data.cropState;
    returnState.cropStateDate = new Date();
    returnState.volume = data.volume;
    returnState.volumeChanged = data.finalState;
    returnState.volumeDate = new Date();
    returnState.showMainSideBar = data.showMainSideBar;
    //console.log(returnState.cropActive);
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      sideBar2: sideBar2,
      emptyData: emptyData,
      showFilters: showFilters,
      showAdjustments: showAdjustments,
      getSelectedType: getSelectedType,
      toolsMenu: toolsMenu,
      getCanvas: getCanvas,
      mainSideBarState: mainSideBarState,
      cropState: cropState,
      isVolume: isVolume,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ToolsHeader));
