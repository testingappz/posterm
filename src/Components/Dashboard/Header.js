import React, { Component } from "react";
import { fabric } from "fabric";
import validator from "validator";
import "fabric-history";
import RecordRTC from "recordrtc";
import { logout } from "../../Utils/services.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { v4 } from "uuid";
import * as jsPDF from "jspdf";
import { Helmet } from "react-helmet";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import {
  fillMe,
  clipMyObject,
  circleMask,
  pattrenMe,
} from "./Handlers/Masking.js";
//import ShareLink from "react-facebook-share-link";
import {
  deselectAll,
  setCanvasBackground,
  getVideoElement,
  removeObject,
} from "./Handlers/Handlers.js";
import {
  emptyData,
  getCanvas,
  headerMenu,
  getSelectedType,
  activeObjectIndex,
  mainSideBarState,
  sideBar2,
  toolsMenu,
  showFilters,
  showAdjustments,
  loader,
  isVolume,
  closeUploads,
  backgroundChange,
  backgroundColorChange,
} from "../../Actions/canvasActions.js";
import {
  saveCanvas,
  uploadCanvasImage,
  getUserCanvas,
  shareDesign,
  socialShareCount,
} from "../../Actions/canvasExternalActions.js";
import {
  saveTemplate,
  uploadTemplate,
  getTemplates,
  uploadFcTemplate,
  getFontTemplates,
} from "../../Actions/templatesActions.js";
//import { getUserVideos } from "../../Actions/sidebarActions.js";

var canvas_history = [];
var s_history = true;
var cur_history_index = 0;
var DEBUG = true;
var ctx;
var sourceNode;
var countCrop = 0;

class Header extends Component {
  constructor(props) {
    const user = JSON.parse(localStorage.getItem("useMe"));
    const sizeData = JSON.parse(sessionStorage.getItem("size"));
    const canvasName = sessionStorage.getItem("canvasName");
    super(props);
    this.state = {
      cid: this.props.match.params.id,
      userInfo: user ? user : {},
      cg: this.props.match.params.cg,
      userId: user ? user._id : "",
      showDropDown: false,
      canvas: "",
      imageName: canvasName ? canvasName : "",
      showDownload: false,
      fileMenu: false,
      showSelect: false,
      downloadType: "PNG",
      userEmail: user ? user.email : "",
      loadedTemplate: {},
      loadedTemplateId: "",
      loadedCanvas: {},
      loadedCanvasId: this.props.match.params.id,
      loadedCanvasUserId: "",
      changeMade: false,
      saving: false,
      undoButton: false,
      redoButton: false,
      headerState: {},
      saveShow: true,
      fileDownload: true,
      nameActive: false,
      historyUndoIndex: -1,
      objectMoved: true,
      activeInput: true,
      filtersLength: -1,
      currentIndex: -1,
      cropActive: false,
      undoClass: "disabled",
      redoClass: "disabled",
      isVideo: false,
      videoType: "mp4",
      canvasSize: sizeData ? sizeData : {},
      cat: "",
      counter: 0,
      backgroundData: {},
      backgroundColorInfo: "#ffffff",
      isBackground: false,
      isBackgroundColor: false,
      showShareMenu: false,
      shareEmail: "",
      shareEmailError: "",
      shareLoading: "",
      canvasImage: "",
      canvasShare: "",
      mainTag: "",
      //templateChange: false,
    };
  }
  handleDropDown = () => {
    this.setState({ showDropDown: !this.state.showDropDown });
  };

  logoutMe = () => {
    this.resetCanvas();
    this.stateShare();
    logout(this.state.cid);

    // this.props.history.push("/login");
  };

  handleInputChange = (event) => {
    //this.props.exportEmptyData();
    const target = event.target;
    let value = target.value;
    /*switch (target.type) {
      case "checkbox": {
        value = target.checked;
        break;
      }
    }*/
    if (event.target.name == "shareEmail") {
      this.setState({ shareLoading: "" });
    }
    this.setState({ [event.target.name]: value });
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};

    if (props.canvas !== undefined && props.canvas !== state.canvas) {
      returnState.changeMade = true;
    }
    if (props.canvas !== undefined) {
      returnState.canvas = props.canvas ? props.canvas : "";

      if (returnState.canvas) {
        returnState.historyUndoIndex = returnState.canvas.historyUndo
          ? returnState.canvas.historyUndo.length
          : 0;

        let objectsArray = returnState.canvas
          ? returnState.canvas.getObjects()
          : [];

        if (objectsArray && objectsArray.length <= 0) {
          returnState.saveShow = false;
          returnState.fileDownload = false;
        }
        if (
          objectsArray &&
          objectsArray.length <= 0 &&
          returnState.canvas.backgroundColor
        ) {
          returnState.saveShow = true;
          returnState.fileDownload = true;
        }

        if (
          objectsArray &&
          objectsArray.length <= 0 &&
          returnState.canvas.backgroundImage
        ) {
          returnState.saveShow = true;
          returnState.fileDownload = true;
        }

        if (objectsArray && objectsArray.length >= 1) {
          returnState.saveShow = true;
          returnState.fileDownload = true;

          /*objectsArray.map((obj, id) => {
            if (obj && obj.video_src) {
              returnState.isVideo = true;
            }
          });*/
        }
      }
    }

    if (
      props.headerState !== undefined &&
      props.headerState !== state.headerState &&
      props.headerTime !== state.headerTime
    ) {
      returnState.headerState = props.headerState;
      returnState.headerTime = props.headerTime;

      returnState.fileMenu = props.headerState
        ? props.headerState.fileMenu
        : false;
      returnState.showDownload = props.headerState
        ? props.headerState.showDownload
        : false;
    }

    if (props.undoRedo !== undefined && props.undoRedo !== state.undoRedo) {
      returnState.undoRedo = props.undoRedo ? props.undoRedo : {};
      returnState.undoButton = props.undoRedo
        ? props.undoRedo.undoButton
        : false;

      returnState.redoButton = props.undoRedo
        ? props.undoRedo.redoButton
        : false;
    }

    if (
      props.loadedTemplate !== undefined &&
      props.loadedTemplate !== state.loadedTemplate
    ) {
      returnState.loadedTemplate = props.loadedTemplate;
      returnState.loadedTemplateId = props.loadedTemplate
        ? props.loadedTemplate._id
        : "";
    }
    if (
      props.loadedCanvas !== undefined &&
      props.loadedCanvas !== state.loadedCanvas
    ) {
      //console.log(props.loadedCanvas);
      returnState.loadedCanvas = props.loadedCanvas;
      returnState.loadedCanvasId = props.loadedCanvas
        ? props.loadedCanvas._id
        : "";
      returnState.loadedCanvasUserId = props.loadedCanvas
        ? props.loadedCanvas.userId
        : "";
    }
    if (
      props.TemplateData !== undefined &&
      props.TemplateData !== state.TemplateData
    ) {
      // console.log(props.TemplateData);
      returnState.saving = false;
      returnState.changeMade = false;
      returnState.cat = "";
      returnState.imageName = "";
      returnState.error = "";
      returnState.nameError = "";
      let formData = {
        category: state.cg,
      };
      props.getTemplates(formData);
      returnState.fileMenu = false;
    }

    if (
      props.savedCanvas !== undefined &&
      props.savedCanvas !== state.savedCanvas &&
      props.savedCanvasDate !== state.savedCanvasDate
    ) {
      // console.log(props.TemplateData);
      returnState.savedCanvasDate = props.savedCanvasDate;
      returnState.fileMenu = false;
      returnState.saving = false;
      returnState.changeMade = false;
      returnState.canvasImage = props.savedCanvas.data
        ? props.savedCanvas.data.canvas_image
        : "";
      returnState.canvasShare = props.savedCanvas.data
        ? props.savedCanvas.data.canvas_share
        : "";
      props.getUserCanvas();

      if (props.savedCanvas && state.shareActive) {
        let formData = {
          email: state.shareEmail,
          canvas_id: props.savedCanvas.data
            ? props.savedCanvas.data.canvas_id
            : "",
          link: props.savedCanvas.data
            ? props.savedCanvas.data.canvas_image
            : "",
        };
        // console.log(formData);
        props.shareDesign(formData);
        returnState.shareActive = false;
        //returnState.showShareMenu = false;
      }
    }

    if (
      props.savedFontCombi !== undefined &&
      props.savedFontCombi !== state.savedFontCombi &&
      props.savedFontDate !== state.savedFontDate
    ) {
      // console.log(props.TemplateData);
      returnState.savedFontDate = props.savedFontDate;
      returnState.saving = false;
      returnState.changeMade = false;
      props.getFontTemplates();
      returnState.fileMenu = false;
    }
    if (
      props.cropActive !== undefined &&
      props.cropActive !== "" &&
      props.cropActive !== state.cropActive &&
      props.cropStateDate !== state.cropStateDate
    ) {
      returnState.cropActive = props.cropActive;
      returnState.cropStateDate = props.cropStateDate;
      returnState.counter = 1;
    }
    if (
      props.toolsState !== undefined &&
      props.toolsState !== state.toolsState
    ) {
      returnState.templateChange = props.toolsState
        ? props.toolsState.templateChange
        : false;
      if (props.toolsState && props.toolsState.category) {
        returnState.cg = props.toolsState.category
          ? props.toolsState.category
          : "cus";
      }
      if (
        props.toolsState &&
        props.toolsState.cid &&
        props.toolsState.template == true
      ) {
        returnState.loadedCanvasId = "";
        returnState.cid = props.toolsState.cid ? props.toolsState.cid : v4();
      }
      if (
        props.toolsState &&
        props.toolsState.cid &&
        props.toolsState.template == false &&
        props.toolsState.myDesign == true
      ) {
        returnState.cid = props.toolsState.cid ? props.toolsState.cid : v4();
      }
    }
    if (
      props.isBackground !== undefined &&
      props.isBackground !== state.isBackground
    ) {
      //console.log(props.isBackground);
      returnState.isBackground = props.isBackground;
    }

    if (
      props.isBackgroundColor !== undefined &&
      props.isBackgroundColor !== state.isBackgroundColor
    ) {
      //console.log(props.isBackground);
      returnState.isBackgroundColor = props.isBackgroundColor;
    }

    if (
      props.sharedData &&
      props.sharedData.code == 200 &&
      props.sharedDate !== state.sharedDate
    ) {
      returnState.sharedDate = props.sharedDate;
      returnState.shareLoading = "Shared";
    }
    if (
      props.showMainSideBar !== undefined &&
      props.showMainSideBar !== state.showMainSideBar
    ) {
      returnState.showMainSideBar = props.showMainSideBar;
    }
    return returnState;
  }

  save_history = async (force) => {
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
    //if we already used undo button and made modification - delete all forward history
    if (cur_history_index < canvas_history.length - 1) {
      canvas_history = canvas_history.slice(0, cur_history_index + 1);
      cur_history_index++;
      this.setState({ undoClass: "disabled", redoClass: "" });
    }

    var cur_canvas = JSON.stringify(json);
    //if current state identical to previous don't save identical states
    if (cur_canvas != canvas_history[cur_history_index] || force == 1) {
      canvas_history.push(cur_canvas);
      cur_history_index = canvas_history.length - 1;
    }

    DEBUG &&
      console.log("saved " + canvas_history.length + " " + cur_history_index);

    this.setState({ undoClass: "", redoClass: "disabled" });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    let canvas = this.state.canvas;

    if (this.state.isBackground == true) {
      this.save_history();
      this.setState({ isBackground: false });
      this.props.backgroundChange(false);
    }

    if (this.state.isBackgroundColor == true) {
      this.save_history();
      this.setState({ isBackgroundColor: false });
      this.props.backgroundColorChange(false);
    }

    if (prevProps.canvas !== prevState.canvas) {
      let canvas = this.state.canvas;
      if (canvas) {
        canvas.observe("after:render", () => {
          let activeObj = canvas.getActiveObject();
          if (
            activeObj &&
            activeObj.type !== "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            if (activeObj.src) {
              this.save_history();
              this.setState({ counter: 0 });
            }
          }
        });
      }

      if (canvas) {
        canvas.observe("object:modified", () => {
          let activeObj = canvas.getActiveObject();
          if (
            activeObj &&
            activeObj.type !== "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false &&
            activeObj.myImage
          ) {
            this.save_history();
          }
        });

        canvas.observe("mouse:up", () => {
          let activeObj = canvas.getActiveObject();
          if (
            activeObj &&
            activeObj.type !== "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false &&
            activeObj.myImage
          ) {
            this.save_history();
          }
        });

        canvas.observe("object:selected", () => {
          let activeObj = canvas.getActiveObject();
          if (
            activeObj &&
            activeObj.type !== "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false
          ) {
            this.save_history();
          } else if (
            activeObj &&
            activeObj.type == "rect" &&
            activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
            this.state.cropActive == false &&
            activeObj.myImage
          ) {
            this.save_history();
          }
        });

        if (!this.state.templateChange && !this.state.undo) {
          canvas.observe("mouse:down", () => {
            let activeObj = canvas.getActiveObject();
            if (
              activeObj &&
              activeObj.type !== "rect" &&
              activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
              this.state.cropActive == false
            ) {
              this.save_history();
            } else if (
              activeObj &&
              activeObj.type == "rect" &&
              activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
              this.state.cropActive == false
            ) {
              this.save_history();
            } else if (
              activeObj &&
              activeObj.type == "rect" &&
              activeObj.fill !== "rgba(0, 0, 0, 0.3)" &&
              this.state.cropActive == false &&
              activeObj.myImage
            ) {
              this.save_history();
            }
          });
        }
      }
    }
    if (prevState.canvas) {
      let activeObject = prevProps.canvas
        ? prevProps.canvas.getActiveObject()
        : {};
      if (activeObject) {
        if (activeObject.filters) {
          if (activeObject.filters.length !== this.state.filtersLength) {
            this.save_history();
            this.setState({ filtersLength: activeObject.filters.length });
          }
        }
      }
    }
  }

  UrlExists = (url) => {
    var http = new XMLHttpRequest();
    http.open("HEAD", url, false);
    http.send();
    return http.status != 404;
  };

  exportVid(blob) {
    alert("exporting video...");
    console.log(blob, "blob");
    const vid = document.createElement("video");
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    vid.preload = "auto";
    vid.style.display = "none";
    document.body.appendChild(vid);
    const a = document.createElement("a");

    a.download = "posterMaker.mp4";

    a.href = vid.src;

    a.click();
  }

  /* call function to start recording the video */
  startRecording = (max) => {
    try {
      //alert('kdjfkgf');
      // $("#video-outer-btn").trigger("click");
      max = max ? max : 1;
      var canvasElt = document.querySelector("canvas");
      const chunks = []; // here we will store our recorded media chunks (Blobs)const sUsrAg = navigator.userAgent;
      var stream = canvasElt.captureStream();
      //const stream = canvas.captureStream(); // grab our canvas MediaStream
      const rec = new MediaRecorder(stream); // init the recorder
      // every time the recorder has new data, we will store it in our array
      rec.ondataavailable = (e) => chunks.push(e.data);
      console.log(chunks, "chunks...");
      // only when the recorder stops, we construct a complete Blob from all the chunks
      setTimeout(
        (rec.onstop = (e) =>
          this.exportVid(new Blob(chunks, { type: "video/mp4" }))),
        1000
      );

      rec.start();
      setTimeout(() => rec.stop(), max * 1000); // stop recording in 3s
    } catch (err) {
      console.log(err);
    }
  };

  /* call function to record RTC */
  recordRtc(event, ext) {
    let canvas = this.state.canvas;
    let videoId = localStorage.getItem("videoId");
    const updatedCanvas = canvas.toJSON();
    var objects = updatedCanvas.objects;
    let is_video = false;
    let testvideo = 0;
    let max = 0;
    let audioUrl = "";
    let main_vid = "";
    for (var i = 0; i < objects.length; i++) {
      if (
        objects[i].hasOwnProperty("gif_src") ||
        objects[i].hasOwnProperty("video_src")
      ) {
        testvideo = 1;
        var vid = document.getElementById(videoId);
        console.log(vid);
        vid.currentTime = 0;
        // vid.volume = 1;
        vid.volume = 0;
        if (vid.duration > max) {
          max = vid.duration;
        }
        if (objects[i].hasOwnProperty("video_src")) {
          is_video = true;
          main_vid = vid;
          audioUrl = vid.src.replace(".mp4", ".mp3");
        }
      }
    }

    if (testvideo == 1) {
      let isYes = this.UrlExists(audioUrl);
      if (main_vid != "") {
        main_vid.currentTime = 0;
      }
      this.startRecording(event, max, isYes ? audioUrl : "", ext);
    }
  }
  /* call function to start the recording */
  startRecording(event, max, audioUrl, ext) {
    // let max = 1;
    var canvas = document.querySelector("canvas");
    // let canvas = this.state.canvas;
    console.log(canvas);
    var canvasStream = canvas.captureStream();

    var finalStream = new MediaStream();
    //var canvasStream = canvas.captureStream();

    RecordRTC.getTracks(canvasStream, "video").forEach(function (track) {
      finalStream.addTrack(track);
    });
    console.log("changing");
    var recorder = new RecordRTC(finalStream, {
      type: "video",
      mimeType: "video/webm=;codecs=vp8",
      bitsPerSecond: 3000000,
      // fileExtension: 'mp4',
      disableLogs: false,
      audioBitsPerSecond: 3000000,
      videoBitsPerSecond: 3000000,
      frameRate: 120,
      sampleRate: 96000,
      desiredSampRate: 96000,
      bufferSize: 98304,
      bitrate: 3000000,
    });
    recorder.startRecording();

    var stop = false;
    (function looper() {
      if (stop) {
        recorder.stopRecording(function () {
          var blob = recorder.getBlob();
          console.log("blob in #########", blob);
          var fileObject = new File([blob], "meme.webm", {
            type: "video/webm",
          });

          canvasStream.stop();
        });
        return;
      }
      setTimeout(looper, 100);
    })();

    var seconds = max - 0.3;

    setTimeout(function () {
      stop = true;
    }, seconds * 1000);
    //})
  }

  download_imgJpg = (el) => {
    const size = JSON.parse(sessionStorage.getItem("size"));

    let canvas = this.state.canvas;
    var transform = canvas.viewportTransform.slice();
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    let imageName = this.state.imageName ? this.state.imageName : "Untitled";

    var image = canvas
      .toDataURL({
        url: "image/jpg",
        multiplier: 0,
        left: 0,
        top: 0,
        width: size ? size.width : 1000,
        height: size ? size.height : 1000,
      })
      .replace("image/jpg", "image/octet-stream");

    //image.crossOrigin = "anonymous";
    var link = document.createElement("a");

    link.download = imageName + ".jpg";
    link.href = image;
    link.click();
    canvas.viewportTransform = transform;
    this.setState({ showDownload: false });
  };

  download_imgPng = (el) => {
    const size = JSON.parse(sessionStorage.getItem("size"));
    console.log(size);
    if (this.state.fileDownload) {
      let canvas = this.state.canvas;
      var transform = canvas.viewportTransform.slice();
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

      let imageName = this.state.imageName ? this.state.imageName : "Untitled";

      let image = canvas
        .toDataURL({
          url: "image/png",
          multiplier: 0,
          left: 0,
          top: 0,
          width: size ? size.width : 1000,
          height: size ? size.height : 1000,
        })
        .replace("image/png", "image/octet-stream");
      var link = document.createElement("a");
      link.download = imageName + ".png";
      link.href = image;
      link.click();
      canvas.viewportTransform = transform;
      this.setState({ showDownload: false });
    }
    this.setState({ fileMenu: false });
  };

  download_pdf = (el) => {
    const size = JSON.parse(sessionStorage.getItem("size"));

    if (this.state.fileDownload) {
      let canvas = this.state.canvas;
      var transform = canvas.viewportTransform.slice();
      canvas.viewportTransform = [0.75, 0, 0, 0, 0, 0.75];

      var imgData = canvas.toDataURL({
        url: "image/png",
        multiplier: 0,
        left: 0,
        top: 0,
        width: size.width,
        height: size.height,
      });

      let widthIn = size.width;
      let heightIn = size.height;
      if (widthIn < heightIn) {
        var pdf = new jsPDF({
          orientation: "p",
          unit: "px",
          format: [widthIn, heightIn],
        });

        pdf.addImage(imgData, "PNG", 0, 0, widthIn, heightIn);
        pdf.save("download.pdf");
      }

      if (widthIn == heightIn) {
        var pdf = new jsPDF({
          orientation: "l",
          unit: "px",
          format: [widthIn, heightIn],
        });

        pdf.addImage(imgData, "PNG", 0, 0, widthIn, heightIn);
        pdf.save("download.pdf");
      }

      if (widthIn > heightIn) {
        var pdf = new jsPDF({
          orientation: "l",
          unit: "px",
          format: [widthIn, heightIn],
        });

        pdf.addImage(imgData, "PNG", 0, 0, widthIn, heightIn);
        pdf.save("download.pdf");
      }

      canvas.viewportTransform = transform;
      this.setState({ showDownload: false });
    }
    this.setState({ fileMenu: false, downloadType: "PNG" });
  };

  deSelect = () => {
    let canvas = this.state.canvas;
    // deselectAll(canvas);
  };

  handleDownloadMenu = () => {
    let canvas = this.state.canvas;
    canvas.discardActiveObject();
    canvas.renderAll();
    this.setState({ fileMenu: false });
    let downloadMenu = this.state.showDownload;
    if (downloadMenu) {
      this.setState({
        showDownload: false,
        videoType: "mp4",
      });
    }
    if (!downloadMenu) {
      this.setState({
        showDownload: true,
        videoType: "mp4",
        showShareMenu: false,
      });
    }
  };

  handleDownload = (e) => {
    let canvas = this.state.canvas;
    let downloadType = this.state.downloadType;
    let objects = canvas.getObjects();
    if (objects && objects.length) {
      objects.map((obj, id) => {
        if (obj && obj.video_src) {
          downloadType = "video";
        }
      });
    }
    //let downloadType = this.state.downloadType;
    if (downloadType === "PNG") {
      this.download_imgPng();
    }
    if (downloadType === "JPG") {
      this.download_imgJpg();
    }

    if (downloadType === "PDF") {
      this.download_pdf();
    }

    if (downloadType == "video") {
      this.recodeMe();
    }
  };

  handleFileMenu = () => {
    this.setState({
      //fileMenu: !this.state.fileMenu, //false due to design changes
      fileMenu: false,
      showDownload: false,
      saving: false,
    });
    setTimeout(() => {
      this.stateShare();
    }, 0);
  };

  stateShare = () => {
    let formData = {
      fileMenu: this.state.fileMenu,
      showDownload: this.state.showDownload,
    };
    this.props.headerMenu(formData);
  };

  /* handleUndoRedo = (e) => {
    let canvas = this.state.canvas;
    let name = e.target.name;
    if (name == "undo") {
      //undo(canvas);
      canvas.undo();
    }
    if (name == "redo") {
      //redo(canvas);
      canvas.redo();
    }
  };*/

  saveJson = async () => {
    let canvas = this.state.canvas;

    //console.log("saved jason is @@@@", json);

    //console.log(this.state.loadedTemplateId);
    //console.log(this.state.cid);
    if (canvas) {
      canvas.discardActiveObject().renderAll();
    }
    const sizeData = sessionStorage.getItem("size");
    if (this.state.saveShow) {
      let email = this.state.userEmail;
      let canvas = this.state.canvas;
      let activeObjectType = canvas._activeObject
        ? canvas._activeObject.type
        : "";

      let objectType = canvas._objects.find((i) => i.type == "group");
      //console.log(objectType);
      if (
        email === "testing@yopmail.com" ||
        email === "testingadmin@yopmail.com"
      ) {
        // console.log(objectType._objects.length);
        if (
          activeObjectType == "group" ||
          (objectType &&
            objectType.type == "group" &&
            objectType._objects &&
            objectType._objects.length < 10)
        ) {
          canvas.backgroundImage = null;
          canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));
        } else {
          if (
            (canvas.backgroundColor == "" && canvas.backgroundImage == "") ||
            (canvas.backgroundColor == null &&
              canvas.backgroundImage == null) ||
            (canvas.backgroundColor == "" && canvas.backgroundImage == null)
          ) {
            setCanvasBackground(canvas, "#ffffff");
          }
        }
      }
      if (
        email !== "testing@yopmail.com" &&
        email !== "testingadmin@yopmail.com"
      ) {
        if (
          canvas.backgroundImage == "" ||
          canvas.backgroundImage == undefined ||
          canvas.backgroundImage == null
        ) {
          if (
            canvas.backgroundColor == null ||
            canvas.backgroundColor == undefined ||
            canvas.backgroundColor == ""
          ) {
            setCanvasBackground(canvas, "#ffffff");
          }
        }
      }

      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.crossOrigin = "anonymous";
      image.src = "/images/template";

      let data = canvas.toDataURL("image/png");
      var newdata = data.replace(
        /^data:image\/png/,
        "data:application/octet-stream"
      );
      var link = document.createElement("a");
      link.download = "lol" + ".png";
      link.href = newdata;

      var blobBin = atob(data.split(",")[1]);

      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }

      var file = new Blob([new Uint8Array(array)], {
        type: "image/png",
      });
      canvas.historyUndo = [];
      let json = canvas.toJSON();
      await json.objects.forEach((element) => {
        //console.log(element);
        if (element.maskname) {
          // console.log(element);
          element.clipTo = null;
          element.fill = null;
        }
      });
      let name = this.state.imageName ? this.state.imageName : Math.random();
      let form_data = new FormData();

      if (
        activeObjectType == "group" ||
        (objectType &&
          objectType.type == "group" &&
          objectType._objects &&
          objectType._objects.length < 10)
      ) {
        if (
          email === "testing@yopmail.com" ||
          email === "testingadmin@yopmail.com"
        ) {
          form_data.append("image", file, name);
          form_data.append(
            "fc_name",
            this.state.imageName
              ? this.state.imageName + ".png"
              : Math.random() + ".png"
          );
          form_data.append("fc_template", JSON.stringify(json));
          form_data.append(
            "fc_size",
            sizeData ? sizeData : JSON.stringify(this.state.canvasSize)
          );
          form_data.append("fcId", this.state.loadedTemplateId);
          form_data.append("category", this.state.cg);
          form_data.append("tag", this.state.tags);

          this.props.uploadFcTemplate(form_data);
        }
      } else {
        if (
          email === "testing@yopmail.com" ||
          email === "testingadmin@yopmail.com"
        ) {
          let isError = false;
          if (
            this.state.cat == undefined ||
            this.state.cat == null ||
            this.state.cat.trim() == ""
          ) {
            this.setState({ error: true });

            isError = true;
          } else {
            this.setState({ error: false });

            isError = false;
          }

          if (
            this.state.mainTag == undefined ||
            this.state.mainTag == null ||
            this.state.mainTag.trim() == ""
          ) {
            this.setState({ error: true });

            isError = true;
          } else {
            this.setState({ error: false });

            isError = false;
          }

          if (
            this.state.imageName == undefined ||
            this.state.imageName == null ||
            this.state.imageName.trim() == ""
          ) {
            this.setState({ nameError: true });
            isError = true;
          } else {
            this.setState({ nameError: false });
            isError = false;
          }
          if (isError == true) {
            return;
          }
          if (isError == false) {
            //  console.log(email);
            form_data.append("image", file, name);
            form_data.append(
              "template_name",
              this.state.imageName
                ? this.state.imageName + ".png"
                : Math.random() + ".png"
            );
            form_data.append("template", JSON.stringify(json));
            form_data.append(
              "template_size",
              sizeData ? sizeData : JSON.stringify(this.state.canvasSize)
            );
            form_data.append("category", this.state.cg ? this.state.cg : "cus");
            form_data.append("tags", this.state.cat);
            form_data.append("main_tag", this.state.mainTag);
            form_data.append("templateId", this.state.loadedTemplateId);
            this.props.uploadTemplate(form_data);
          }
        }
      }

      if (
        email !== "testing@yopmail.com" &&
        email !== "testingadmin@yopmail.com"
      ) {
        form_data.append("image", file, name);
        form_data.append(
          "canvas_name",
          this.state.imageName
            ? this.state.imageName
            : "untitled" + Math.random() + ".png"
        );

        form_data.append(
          "canvas_size",
          sizeData ? sizeData : JSON.stringify(this.state.canvasSize)
        );
        form_data.append("canvas_object", JSON.stringify(json));
        form_data.append("canvasId", this.state.loadedCanvasId);
        form_data.append("canvas_id", this.state.cid);
        form_data.append("category", this.state.cg);
        form_data.append("userId", this.state.userId ? this.state.userId : "");
        this.props.uploadCanvasImage(form_data);
        //this.props.saveCanvas(formData);
        this.setState({ saving: true });
      }
    }
  };

  resetCanvas = () => {
    let canvas = this.state.canvas;
    let obj = canvas.getObjects();
    let random = Math.random().toString(36).substring(7);
    let cg = this.state.cg ? this.state.cg : "cus";
    let id = v4();
    if (obj && obj.length) {
      for (let i = 0; i <= obj.length; i++) {
        if (obj && obj[i] && obj[i].videoId) {
          var vid = document.querySelector("video");
          let vidName = vid.getAttribute("name");
          if (vid && vidName !== "displayFor") {
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
    }

    canvas.clear();
    sessionStorage.removeItem("J-" + this.props.match.params.id);
    sessionStorage.removeItem("LTID");
    this.setState({
      fileMenu: false,
      imageName: "",
      canvas: "",
      loadedTemplateId: "",
      loadedCanvasUserId: "",
      loadedCanvasId: "",
      undoClass: "disabled",
      redoClass: "disabled",
      cat: "",
      canvasImage: "",
    });
    canvas_history = [];
    s_history = true;
    cur_history_index = 0;
    DEBUG = true;
    // console.log(canvas.getObjects());
    this.props.getSelectedType("");
    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
      templateChange: false,
    };
    if (this.state.selectedType !== "textbox") {
      this.props.sideBar2(false);
    }

    this.props.toolsMenu(formData);
    this.props.showFilters(false);
    this.props.showAdjustments(false);
    this.props.mainSideBarState(true);
    this.setState({ cid: id, cg: cg });
    this.props.history.push(`/design/${id}/edit/${cg}&cat=${random}`);
  };

  onFocusName = () => {
    this.setState({ showDownload: false, fileMenu: false });
  };

  showInputActive = () => {
    document.getElementById("untitled-input").focus();
    this.setState({ activeInput: !this.state.activeInput });
  };

  redo = () => {
    let canvas = this.state.canvas;

    let count = 0;
    if (canvas_history[cur_history_index + 1]) {
      s_history = false;
      let canv_data = JSON.parse(canvas_history[cur_history_index + 1]);
      console.log(canv_data);
      let data = canv_data;
      //canvas.loadFromJSON(canv_data);
      data &&
        data.objects.map((obj, id) => {
          if (obj.video_src) {
            //  let videoId = obj.videoId;
            var vid = document.querySelector("video");

            if (vid) {
              vid.muted = "muted";
              vid.pause();
              vid.src = "";
              vid.removeAttribute("src");
              vid.parentNode.removeChild(vid);
            }
          }
        });

      if (data) {
        canvas.loadFromJSON(JSON.stringify(data), canvasLoaded, async function (
          o,
          object
        ) {
          await new Promise((resolve, reject) => {
            if (
              object &&
              object.maskname &&
              object.fill == null &&
              object.myImage
            ) {
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

            // fabric.log(o, object);
          });
        });
        function canvasLoaded() {
          canvas.renderAll.bind(data);
          var bin;
          var objs = data["objects"];
          for (var i = 0; i < objs.length; i++) {
            if (
              objs[i].type !== " image" &&
              objs[i].type == "path" &&
              objs[i].maskname
            ) {
              bin = objs[i];
            }
            if (objs[i].hasOwnProperty("video_src")) {
              // console.log(i);
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
                objs[i]["flipY"]
              );

              // localStorage.setItem("J", JSON.stringify(canvas));
            }
          }
        }
      }
      cur_history_index++;
      DEBUG &&
        console.log("redo " + canvas_history.length + " " + cur_history_index);

      this.setState({ undoClass: "", fileMenu: false });
      this.props.closeUploads(false);
      this.props.getCanvas(canvas);
      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: false,
        showFlip: false,
        //templateChange: true,
      };
      this.props.toolsMenu(formData);
    } else {
      this.setState({ redoClass: "disabled", fileMenu: false, undo: true });
    }
    this.props.showFilters(false);
    this.props.showAdjustments(false);
    if (this.state.showMainSideBar === false) {
      this.props.mainSideBarState(false);
    } else {
      this.props.mainSideBarState(true);
    }
    // this.props.getUserVideos();

    this.props.getSelectedType("");
  };

  undo = () => {
    let canvas = this.state.canvas;

    if (cur_history_index > 0) {
      s_history = false;
      let canv_data = JSON.parse(canvas_history[cur_history_index - 1]);
      //console.log(canv_data);
      let data = canv_data;
      data &&
        data.objects.map((obj, id) => {
          if (
            obj.type === "rect" &&
            obj.fill === "rgba(0, 0, 0, 0.3)" && // remove Crop react from undo redo
            !this.state.cropActive
          ) {
            data.objects.pop();
          }

          if (obj.video_src) {
            //console.log(obj.videoId);

            // console.log(vid);
            var vid = document.querySelector("video");
            if (vid) {
              vid.muted = "muted";
              vid.pause();
              vid.src = "";
              vid.removeAttribute("src");
              vid.parentNode.removeChild(vid);
            }
          }
        });
      if (data) {
        canvas.loadFromJSON(JSON.stringify(data), canvasLoaded, async function (
          o,
          object
        ) {
          await new Promise((resolve, reject) => {
            if (
              object &&
              object.maskname &&
              object.fill == null &&
              object.myImage
            ) {
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
          });
        });
        function canvasLoaded() {
          canvas.renderAll.bind(data);
          var bin;
          var objs = data["objects"];

          for (var i = 0; i < objs.length; i++) {
            if (
              objs[i].type !== " image" &&
              objs[i].type == "path" &&
              objs[i].maskname
            ) {
              bin = objs[i];
            }
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
                objs[i]["flipY"]
              );

              // localStorage.setItem("J", JSON.stringify(canvas));
            }
            if (
              objs[i].type == "rect" &&
              objs[i].fill == "rgba(0, 0, 0, 0.3)"
            ) {
              removeObject(canvas, objs[i]);
            }
          }
        }
      }
      //canvas.loadFromJSON(canv_data);
      cur_history_index--;
      DEBUG &&
        console.log("undo " + canvas_history.length + " " + cur_history_index);
      this.setState({ redoClass: "", fileMenu: false });
      let formData = {
        showOpacity: false,
        showPositionDropdown: false,
        showLine: false,
        showFlip: false,
        //templateChange: true,
      };
      this.props.closeUploads(false);
      this.props.getCanvas(canvas);
      this.props.toolsMenu(formData);
    } else {
      this.setState({
        undoClass: "disabled",
        fileMenu: false,
        redo: true,
        undo: false,
      });
    }
    this.props.showFilters(false);
    this.props.showAdjustments(false);
    if (this.state.showMainSideBar === false) {
      this.props.mainSideBarState(false);
    } else {
      this.props.mainSideBarState(true);
    }
    //this.props.getUserVideos();
    this.props.getSelectedType("");

    console.log(canvas._objects);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps != nextState) {
      return true;
    } else {
      return false;
    }
  }

  startDownloadJpg = (e, ext) => {
    //this.startLoading();
    // $(".loading").show();

    let canvas = this.state.canvas;
    let videoId = localStorage.getItem("videoId");
    let canvasId = localStorage.getItem("canvasId");
    let testvideo = 0;
    const updatedCanvas = canvas;
    let max = 1;
    var objects = updatedCanvas._objects;
    let is_video = false;
    let audioUrl = "";

    for (var i = 0; i < objects.length; i++) {
      if (
        objects[i].hasOwnProperty("gif_src") ||
        objects[i].hasOwnProperty("video_src")
      ) {
        if (objects[i].hasOwnProperty("video_src")) {
          var vid = document.getElementById(videoId);
          audioUrl = vid.src.replace(".mp4", ".mp3");
          let isYes = this.UrlExists(audioUrl);
          audioUrl = isYes ? audioUrl : "";
        }
        console.log(audioUrl, "audiourl");
        testvideo = 1;
        var vid = document.getElementById(videoId);
        vid.currentTime = 0;
        // vid.muted = false;
        if (vid.duration > max) {
          max = vid.duration;
        }
      }

      if (objects[i].hasOwnProperty("video_src")) {
        is_video = true;
      }
    }

    if (testvideo == 1) {
      try {
        //alert('kdjfkgf');
        //$("#video-outer-btn").trigger("click");
        var canvasElt = document.getElementById(canvasId);
        const chunks = []; // here we will store our recorded media chunks (Blobs)const sUsrAg = navigator.userAgent;
        var stream = canvasElt.captureStream()
          ? canvas.captureStream()
          : canvas.mozCaptureStream();
        //const stream = canvas.captureStream(); // grab our canvas MediaStream
        const rec = new MediaRecorder(stream); // init the recorder
        // every time the recorder has new data, we will store it in our array
        rec.ondataavailable = (e) => chunks.push(e.data);
        console.log(chunks, "chunks....");
        // only when the recorder stops, we construct a complete Blob from all the chunks
        // rec.onstop = e => this.exportVid(new Blob(chunks, {type: 'video/mp4'}));
        rec.onstop = (e) =>
          this.logVideoDuration(new Blob(chunks, { type: "video/mp4" }));
        rec.start();
        setTimeout(() => rec.stop(), max * 1000); // stop recording in 3s
      } catch (err) {
        //this.stopLoading();
        // $(".loading").hide();
        alert(
          "Please enable Mediarecorder on your browser to download canvas video."
        );
      }

      // }
    }
    /*if ($("#dwn_el").length > 0) {
      setTimeout(function () {
        $("#dwn_el").remove();
      }, 250);
    }*/
  };

  logVideoDuration = (blob) => {
    const el = document.createElement("video");
    el.src = URL.createObjectURL(blob);
    //console.log(blob);
    el.play().then(() => {
      el.pause();
      el.onseeked = (evt) => console.log("poster", el.duration);
      el.currentTime = 10e25;
    });

    let a = document.createElement("a");
    // document.body.appendChild(a);
    a.download = "posterMaker.mp4";
    // a.id = "dwn_el";
    a.href = el.src;
    //a.textContent = "  ";
    // document.getElementById("dwn_el").click();
    //a.style.visibility = "hidden";
    a.click();
  };

  recodeMe = () => {
    //var ctx;
    //var sourceNode;
    this.props.loader(true);
    let canvasIn = this.state.canvas;
    var canvas = document.querySelector("canvas");
    let objData = canvasIn._objects;
    let myName = this.state.imageName;
    let videoExt = this.state.videoType;
    let max = 30000;
    let count = 0;
    let duration;
    let totalVolume = 0;
    let videoSrc = [];
    // Optional frames per second argument.
    let volumeIdChange = "";
    let firstElement = 0;
    var stream = canvas.captureStream()
      ? canvas.captureStream()
      : canvas.mozCaptureStream();
    if (objData && objData.length) {
      let result = false;
      for (var i in objData) {
        //console.log(objData[i].videoVolume);
        if (objData[i].videoVolume === true) {
          totalVolume++;
          result = true;
          break;
        }
      }
      //console.log(totalVolume);
      objData.map((obj, id) => {
        //console.log(obj);
        if (obj.video_src) {
          // console.log(obj.videoVolume);

          if (obj.videoId && result !== undefined && result == false) {
            // console.log(obj.videoVolume);
            //obj.set("videoVolume", true); // always true while downloading
            obj.set("videoVolume", obj.videoVolume); // volume true or false
            volumeIdChange = obj.videoId;
          }

          if (obj.videoVolume && firstElement == 0) {
            //   console.log(obj.videoId);
            //console.log(obj.videoVolume);
            let videoId = obj.videoId;
            let vid = document.getElementById(videoId);
            //vid.play();
            vid.muted = false;
            vid.currentTime = 0;
            duration = vid.duration.toFixed(1) * 1000;
            ctx = ctx || new AudioContext();
            let dest = ctx.createMediaStreamDestination();
            if (sourceNode) {
              sourceNode.disconnect();
            }
            sourceNode = sourceNode || ctx.createMediaElementSource(vid);
            sourceNode.connect(dest);
            sourceNode.connect(ctx.destination);
            //console.log(dest.stream.getAudioTracks());
            let audioTrack = dest.stream.getAudioTracks()[0];
            //console.log(audioTrack);
            // add it to your canvas stream:
            if (audioTrack.label) {
              stream.addTrack(audioTrack);
            }
            //sourceNode.disconnect();
          }
        }
      });
    }
    // get the audio track:

    var recordedChunks = [];
    //  console.log(stream);

    var options = { mimeType: "video/webm; codecs=vp9" };
    if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
      options = { mimeType: "video/webm; codecs=vp9" };
    } else {
      options = { mimeType: "video/webm; codecs=vp8" };
    }
    var mediaRecorder = new MediaRecorder(stream, options);

    //console.log(duration);

    if (duration < 9000) {
      max = 9000;
    }
    if (duration < max && duration > 9000) {
      max = duration;
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    function handleDataAvailable(event) {
      //console.log("data-available");
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
        // console.log(recordedChunks);

        if (videoExt == "mp4") {
          download();
        }

        if (videoExt == "webm") {
          downloadWeb();
        }

        if (videoExt == "3gp") {
          download3gp();
        }

        if (videoExt == "mov") {
          downloadMov();
        }
      } else {
        // ...
      }
    }

    function download() {
      let blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });

      //var url = URL.createObjectURL(blob);
      const downloadUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.crossOrigin = "anonymous";
      a.setAttribute("crossorigin", "anonymous");
      a.style = "display: none";
      a.href = downloadUrl;
      a.download = myName ? myName : "posterMaker";

      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    }

    function downloadWeb() {
      var blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      //a.crossOrigin = "anonymous";
      //a.setAttribute("crossorigin", "anonymous");
      a.style = "display: none";
      a.href = url;
      a.download = myName ? myName : "posterMaker";
      a.click();
      window.URL.revokeObjectURL(url);
    }

    function download3gp() {
      var blob = new Blob(recordedChunks, {
        type: "video/3gp",
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      //a.crossOrigin = "anonymous";
      //a.setAttribute("crossorigin", "anonymous");
      a.style = "display: none";
      a.href = url;
      a.download = myName ? myName + ".3gp" : "posterMaker.3gp";
      a.click();
      window.URL.revokeObjectURL(url);
    }

    function downloadMov() {
      var blob = new Blob(recordedChunks, {
        type: "video/mov",
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      //a.crossOrigin = "anonymous";
      //a.setAttribute("crossorigin", "anonymous");
      a.style = "display: none";
      a.href = url;
      a.download = myName ? myName + ".mov" : "posterMaker.mov";
      a.click();
      window.URL.revokeObjectURL(url);
    }

    // demo: to download after 9sec
    setTimeout((event) => {
      console.log("stopping");
      mediaRecorder.stop();
      /*sourceNode.onended = function () {
        sourceNode.stop(0);
        //playFirst();
      };*/

      this.props.loader(false);
      //this.props.isVolume(true, true);
      this.setState({ showDownload: false });
      if (objData && objData.length) {
        objData.map((obj, id) => {
          let canvas = this.state.canvas;
          //console.log(obj);
          if (obj && obj.video_src) {
            let videoId = obj.videoId;
            var vid = document.getElementById(videoId);

            if (obj.videoVolume == true) {
              obj.set("videoVolume", true);
              if (volumeIdChange == obj.videoId) {
                obj.set("videoVolume", false);
              }
            }
            if (obj.videoVolume == false) {
              obj.set("videoVolume", false);

              vid.muted = true;
            }
          }
        });

        this.props.getSelectedType("");
      }
    }, max);
  };

  takeMeToHome = () => {
    console.log(this.state.cid);
    sessionStorage.removeItem("J-" + this.state.cid);
    sessionStorage.removeItem("size");
    this.props.history.push("/home");
  };

  showShareMenu = () => {
    this.saveJson();
    this.setState({
      showShareMenu: true,
      shareEmail: "",
      shareEmailError: "",
      shareLoading: "",
      showDownload: false,
      canvasImage: "",
    });
  };

  dismissShareMenu = () => {
    //this.saveJson();
    this.setState({
      showShareMenu: false,
      shareEmail: "",
      shareEmailError: "",
      shareLoading: "",
      showDownload: false,
      canvasImage: "",
    });
  };

  shareOnEmail = () => {
    let error = false;
    // console.log(this.state.shareEmail);
    if (
      this.state.shareEmail == undefined ||
      this.state.shareEmail == null ||
      this.state.shareEmail.trim() == ""
    ) {
      this.setState({ shareEmailError: "fieldError" });

      error = true;
    }

    if (!validator.isEmail(this.state.shareEmail)) {
      this.setState({
        formError: true,
        shareEmailError: "fieldError",
        errorMessage: "Email entered is invalid!",
      });
      error = true;
      return;
    }

    if (error == true) {
      return;
    }
    this.setState({ shareActive: true, shareLoading: "sharing..." });
    this.saveJson();
  };

  posterShared = (value, image) => {
    let userDetails = this.state.userInfo ? this.state.userInfo : {};
    let formData = {
      shared_on: value ? value : "",
      name: userDetails.name,
      email: userDetails.email,
      shared_template: image ? image : "",
    };
    this.props.socialShareCount(formData);
  };

  render() {
    let canvas = this.state.canvas;
    canvas_history.map((obj, id) => {
      // console.log(JSON.parse(obj));
    });
    //console.log(canvas);
    let isVideo = false;
    if (canvas) {
      let objects = canvas.getObjects();
      objects.map((obj, id) => {
        if (obj && obj.video_src) {
          isVideo = true;
        }
      });
    }
    //console.log(this.state.shareEmailError);
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Poster Maker</title>
          <link rel="canonical" href="https://posterapplab.com" />
          <meta property="og:url" content="https://posterapplab.com" />
          <meta property="og:type" content="web" />
          <meta property="og:title" content="Poster Maker Design Tool" />
          <meta property="og:description" content="Ultimate Design Tool" />
          <meta property="og:image" content={this.state.canvasImage} />
        </Helmet>
        {/*<!-----------------_TOP_MENU----------------->*/}
        <div className="poster-conatiner p-0" onClick={this.deSelect}>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="top-menu">
                <div className="menu-block">
                  <ul className="menu-left-ul">
                    {/*<li>
                      <a href="#" className="">
                        <i className="fa fa-caret-left" aria-hidden="true"></i>{" "}
                        Home
                      </a>
                    </li>*/}
                    <li className="file">
                      <a onClick={this.takeMeToHome} className="">
                        <img
                          src="/img/home_ic.svg"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </a>
                      {/*<a onClick={this.handleFileMenu} className="">
                        File
                      </a>*/}
                      {this.state.fileMenu && (
                        <ul className={"print-dropdown file-dropdown"}>
                          <li
                            className={
                              this.state.nameError
                                ? "file-dropdown fieldError"
                                : "file-dropdown"
                            }
                          >
                            <input
                              type="text"
                              id="untitled-input"
                              className={
                                !this.state.activeInput
                                  ? "untitled-input active-untitled-input"
                                  : "untitled-input"
                              }
                              placeholder="Untitled design - Poster"
                              value={this.state.imageName}
                              onChange={this.handleInputChange}
                              name="imageName"
                              autoComplete="off"
                              disabled={this.state.activeInput}
                            />
                            <span
                              className="d-block"
                              onClick={this.showInputActive}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </span>
                            {/*<h6>14.8cm × 10.5cm</h6>*/}
                          </li>
                          <li className="b-border" onClick={this.resetCanvas}>
                            Create new design
                          </li>
                          {/*<li>Show margins</li>
                          <li className="b-border">Show print bleed</li>*/}
                          <li
                            onClick={this.saveJson}
                            className={
                              this.state.saveShow
                                ? "b-border"
                                : "b-border disabled-file-menu"
                            }
                          >
                            Save
                            {this.state.changeMade && !this.state.saving && (
                              <span className="all-saved">Unsaved Changes</span>
                            )}
                            {this.state.saving && !this.state.changeMade && (
                              <span className="all-saved">Saving...</span>
                            )}
                            {!this.state.saving && !this.state.changeMade && (
                              <span className="all-saved">
                                All changes saved
                              </span>
                            )}
                          </li>
                          {/*<li>Save to folder</li>
                          {/*<li>Resolved Comments</li>*/}
                          {/*<li>Version History</li>}
                          <li>Make a copy</li>*/}
                          <li
                            className={
                              this.state.fileDownload
                                ? "b-border"
                                : "b-border disabled-file-menu"
                            }
                            onClick={this.download_imgPng}
                          >
                            Download
                          </li>
                          {/*<li>Help</li>*/}
                        </ul>
                      )}
                    </li>
                    <li>
                      <a
                        onClick={this.resetCanvas}
                        className="button button-dark button-iconed ml-3"
                      >
                        <img src="/img/add_ic.svg" />
                        Create new design
                      </a>
                    </li>
                    {/* <li>
                      <a href="#" className="">
                        Resize
                      </a>
                    </li>*/}
                    {/*<li>
                      <a href="#" className="">
                        All changes saved
                      </a>
                    </li>*/}
                    {canvas_history && canvas_history.length > 1 && (
                      <li
                        className={
                          this.state.undoClass || cur_history_index <= 0
                            ? "redo-img disabled ml-3"
                            : "redo-img ml-3"
                        }
                        onClick={() => this.undo()}
                        name="undo"
                        data-id={1}
                      >
                        <a name="undo">
                          {<img src="/img/undo.png" name="undo" />}
                        </a>
                      </li>
                    )}

                    {canvas_history && canvas_history.length > 1 && (
                      <li
                        className={
                          this.state.redoClass ||
                          cur_history_index == canvas_history.length - 1
                            ? "redo-img disabled"
                            : "redo-img"
                        }
                        onClick={() => this.redo()}
                        name="redo"
                      >
                        <a name="redo">
                          {<img src="/img/redo.png" name="redo" />}
                        </a>
                      </li>
                    )}
                  </ul>
                  <ul className="print-section">
                    <li className="input-li">
                      <input
                        type="text"
                        name="imageName"
                        placeholder="Untitled design - Poster Maker"
                        value={this.state.imageName}
                        onChange={this.handleInputChange}
                        autoComplete="off"
                        onFocus={this.onFocusName}
                        className={
                          this.state.nameError ? "fieldError" : "posterName"
                        }
                      />
                    </li>
                    {(this.state.userEmail === "testing@yopmail.com" ||
                      this.state.userEmail === "testingadmin@yopmail.com") && (
                      <li className="input-li ml-3">
                        <input
                          type="text"
                          name="cat"
                          placeholder="tags"
                          value={this.state.cat}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                          onFocus={this.onFocusName}
                          className={
                            this.state.error ? "fieldError" : "posterName"
                          }
                        />
                      </li>
                    )}
                    {(this.state.userEmail === "testing@yopmail.com" ||
                      this.state.userEmail === "testingadmin@yopmail.com") && (
                      <li className="input-li ml-3">
                        <input
                          type="text"
                          name="mainTag"
                          placeholder="main tag"
                          value={this.state.mainTag}
                          onChange={this.handleInputChange}
                          autoComplete="off"
                          onFocus={this.onFocusName}
                          className={
                            this.state.error ? "fieldError" : "posterName"
                          }
                        />
                      </li>
                    )}
                  </ul>
                  <ul className="print-section">
                    {this.state.changeMade && !this.state.saving && (
                      <span className="changes">Unsaved Changes</span>
                    )}
                    {this.state.saving && !this.state.changeMade && (
                      <span className="changes">Saving...</span>
                    )}
                    {!this.state.saving && !this.state.changeMade && (
                      <span className="changes">All changes saved</span>
                    )}

                    <a
                      className="button button-dark button-iconed ml-3"
                      onClick={this.saveJson}
                    >
                      <img src="/img/save_ic.svg" />
                      Save
                    </a>
                    {
                      <li style={{ position: "relative" }}>
                        <a
                          onClick={this.showShareMenu}
                          className="button button-dark button-iconed ml-3"
                        >
                          <img src="/img/share.svg" />
                          Share
                        </a>

                        {
                          <ul
                            className={
                              this.state.showShareMenu
                                ? "print-dropdown download-dropdown inner-print-dropdown mt-2 share-dropdown"
                                : "noDisplay"
                            }
                          >
                            <li className="download-drop">
                              <span className="download">Share Design</span>
                              <span
                                className={"float-right"}
                                onClick={this.dismissShareMenu}
                              >
                                <i
                                  className="fa fa-close"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </li>
                            <li>
                              <div className="dropdown ">
                                <h6 className="mb-2">Enter Email</h6>
                                <input
                                  type="email"
                                  name="shareEmail"
                                  className={
                                    this.state.shareEmailError
                                      ? "form-control fieldError"
                                      : "form-control"
                                  }
                                  value={this.state.shareEmail}
                                  onChange={this.handleInputChange}
                                  required={true}
                                />
                              </div>
                              <button
                                className="button button-dark w-100"
                                style={{ marginTop: "10px" }}
                                onClick={(e) => this.shareOnEmail(e)}
                              >
                                {this.state.shareLoading
                                  ? this.state.shareLoading
                                  : "Share on Email"}
                              </button>
                            </li>

                            <li style={{ borderTop: "1px solid #dcdcdc" }}>
                              {
                                <FacebookShareButton
                                  url={
                                    this.state.canvasShare
                                      ? this.state.canvasShare
                                      : this.state.canvasImage
                                      ? this.state.canvasImage
                                      : ""
                                  }
                                  quote={`Hey, I have just created the design over Poster Maker ${this.state.canvasImage}`}
                                  hashtag="#postermaker"
                                  style={{ width: "100%" }}
                                  onShareWindowClose={(value, image) =>
                                    this.posterShared(
                                      "facebook",
                                      this.state.canvasImage
                                    )
                                  }
                                  disabled={
                                    this.state.canvasImage ? false : true
                                  }
                                >
                                  <span
                                    className="button button-dark w-100 fb-share-button"
                                    type="button"
                                    style={{
                                      color: "#fff",
                                      backgroundColor: "#1778f2",
                                    }}
                                    data-href="https://posterapplab.com"
                                  >
                                    <span>Share on Facebook</span>
                                  </span>
                                </FacebookShareButton>
                              }

                              {
                                <TwitterShareButton
                                  url={
                                    this.state.canvasShare
                                      ? this.state.canvasShare
                                      : this.state.canvasImage
                                      ? this.state.canvasImage
                                      : ""
                                  }
                                  title={`Hey, I have just created the design over Poster Maker`}
                                  hashtag="#postermaker"
                                  via="posterapplab.com"
                                  style={{ width: "100%" }}
                                  onShareWindowClose={(value, image) =>
                                    this.posterShared(
                                      "twitter",
                                      this.state.canvasImage
                                    )
                                  }
                                  disabled={
                                    this.state.canvasImage ? false : true
                                  }
                                >
                                  <span
                                    className="button button-dark w-100 fb-share-button mt-2"
                                    type="button"
                                    style={{
                                      color: "#fff",
                                      backgroundColor: "#00acee",
                                    }}
                                    data-href="https://posterapplab.com"
                                  >
                                    <span>Share on Twitter</span>
                                  </span>
                                </TwitterShareButton>
                              }
                            </li>
                          </ul>
                        }
                      </li>
                    }
                    <li className="downlaod-poster downloadIcon">
                      {/*this.state.fileDownload && (
                        <a
                          onClick={this.handleDownloadMenu}
                          className="button button-light button-iconed ml-3"
                        >
                          <img src="/img/downlaod_ic.svg" />
                          Download
                        </a>
                      )*/}
                      <a
                        onClick={this.handleDownloadMenu}
                        className="button button-light button-iconed ml-3"
                      >
                        <img src="/img/downlaod_ic.svg" />
                        Download
                      </a>
                      {/*</li>!this.state.fileDownload && (
                        <a
                          onClick={this.handleDownloadMenu}
                          className="button button-light button-iconed ml-3 button-deactivated"
                        >
                          <img src="/img/downlaod_ic.svg" />
                          Download
                        </a>
                      )*/}
                      {
                        <ul
                          className={
                            !this.state.showDownload
                              ? "noDisplay"
                              : "print-dropdown download-dropdown inner-print-dropdown mt-2"
                          }
                        >
                          <li className="download-drop">
                            <span className="download">Download</span>
                            <span
                              className={"float-right"}
                              onClick={this.handleDownloadMenu}
                            >
                              <i className="fa fa-close" aria-hidden="true"></i>
                            </span>
                          </li>
                          <li>
                            <div className="dropdown ">
                              <h6 className="mb-2">File Type</h6>
                              {!isVideo && (
                                <select
                                  className="download-menu form-control"
                                  value={this.state.downloadType}
                                  onChange={this.handleInputChange}
                                  name={"downloadType"}
                                >
                                  <option value={"PNG"}>PNG</option>
                                  <option value={"JPG"}>JPG</option>
                                  <option value={"PDF"}>PDF</option>
                                </select>
                              )}
                              {isVideo && (
                                <select
                                  className="download-menu form-control"
                                  value={this.state.videoType}
                                  onChange={this.handleInputChange}
                                  name={"videoType"}
                                >
                                  <option value={"mp4"}>MP4</option>
                                  <option value={"webm"}>Webm</option>
                                  <option value={"3gp"}>3gp</option>
                                  <option value={"mov"}>Mov</option>
                                </select>
                              )}
                            </div>
                          </li>
                          <li>
                            <button
                              className="button button-dark w-100"
                              onClick={(e) => this.handleDownload(e)}
                            >
                              Download
                            </button>
                          </li>
                        </ul>
                      }
                    </li>
                    <li
                      className="downlaod-poster logoutIcon"
                      onClick={this.logoutMe}
                    >
                      <a className="button button-dark button-iconed ml-3">
                        <img src="/img/logout_ic.svg" />
                        Logout
                      </a>
                    </li>
                    {/*<li className="print-li">
                      <a className="print-poster" onClick={this.handleDropDown}>
                        <i className="fa fa-print" aria-hidden="true"></i>{" "}
                        &nbsp; Print Poster &nbsp;
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </a>
                      {this.state.showDropDown && (
                        <ul
                          className={
                            this.state.showDownload
                              ? "noDisplay"
                              : "print-dropdown"
                          }
                        >
                          <li className="search-dropdown">
                            <div className="input-group rounded-pill">
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
                                type="search"
                                placeholder="Search Templates"
                                aria-describedby="button-addon4"
                                className="form-control bg-none border-0 width-fix"
                              />
                            </div>
                          </li>
                          <li>
                            <i className="fa fa-print" aria-hidden="true"></i>{" "}
                            Print Cards
                          </li>
                          <li onClick={this.handleDownloadMenu}>
                            <i
                              className="fa fa-download"
                              aria-hidden="true"
                            ></i>{" "}
                            Download
                          </li>
                          <li>
                            <i className="fa fa-link" aria-hidden="true"></i>{" "}
                            Share Link
                          </li>
                          <li>
                            <i className="fa fa-twitter" aria-hidden="true"></i>{" "}
                            Twitter
                          </li>
                          <li>
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                            Facebook
                          </li>
                          <li onClick={this.logoutMe}>
                            <i
                              className="fa fa-sign-out"
                              aria-hidden="true"
                            ></i>
                            Logout
                          </li>
                        </ul>
                      )}
                    </li>*/}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!---------------------------->*/}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};
  const data = state.CanvasReducer;

  if (data) {
    returnState.canvas = data ? data.canvasData : {};
    returnState.undoRedo = data ? data.data : {};
    returnState.headerState = data ? data.data : {};
    returnState.headerTime = new Date();
    returnState.cropActive = data.cropState;
    returnState.cropStateDate = new Date();
    returnState.toolsState = data.toolsState;
    returnState.volume = data.volume;
    returnState.isBackground = data ? data.isBackground : false;
    returnState.isBackgroundColor = data ? data.isBackgroundColor : false;
    returnState.showMainSideBar = data.mainSidebar;
  }

  if (state.TemplateReducer.action === "UPLOAD_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.TemplateData = state.TemplateReducer.data;
    }
  }

  if (state.TemplateReducer.action === "LOAD_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.loadedTemplate = state.TemplateReducer.data;

      //  / console.log(returnState.loadedTemplate);
    }
  }
  if (state.CanvasExternalReducer.action === "LOAD_CANVAS") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.loadedCanvas = state.CanvasExternalReducer.data;
      //console.log(canvasData);
    }
  }
  if (state.CanvasExternalReducer.action === "UPLOAD_CANVAS_IMAGE") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.savedCanvas = state.CanvasExternalReducer.data;
      returnState.savedCanvasDate = new Date();
      // console.log(returnState.savedCanvas);
    }
  }

  if (state.TemplateReducer.action === "UPLOAD_FONT_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.savedFontCombi = state.TemplateReducer.data;
      returnState.savedFontDate = new Date();
    }
  }

  if (state.CanvasExternalReducer.action === "SHARE_CANVAS_DESIGN") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.sharedData = state.CanvasExternalReducer.data;
      returnState.sharedDate = new Date();
      //console.log(canvasData);
    }
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      saveCanvas: saveCanvas,
      saveTemplate: saveTemplate,
      uploadCanvasImage: uploadCanvasImage,
      uploadTemplate: uploadTemplate,
      getTemplates: getTemplates,
      getUserCanvas: getUserCanvas,
      uploadFcTemplate: uploadFcTemplate,
      getFontTemplates: getFontTemplates,
      getCanvas: getCanvas,
      headerMenu: headerMenu,
      getSelectedType: getSelectedType,
      mainSideBarState: mainSideBarState,
      sideBar2: sideBar2,
      toolsMenu: toolsMenu,
      showFilters: showFilters,
      showAdjustments: showAdjustments,
      loader: loader,
      isVolume: isVolume,
      closeUploads: closeUploads,
      backgroundChange: backgroundChange,
      backgroundColorChange: backgroundColorChange,
      shareDesign: shareDesign,
      socialShareCount: socialShareCount,
      // getUserVideos: getUserVideos,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
