import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { ChromePicker } from "react-color";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import Templates from "./subSections/Templates";
import Uploads from "./subSections/Uploads";
import Photos from "./subSections/Photos";
import GiphySection from "./subSections/GiphySection.js";
import Elements from "./subSections/Elements";
import TextSection from "./subSections/TextSection";
import Videos from "./subSections/Videos";
import Background from "./subSections/Background";
import Folders from "./subSections/Folders";
import {
  setBackground,
  addHeadingData,
  emptyData,
  showAdjustments,
  headerMenu,
  toolsMenu,
  getCanvas,
  mainSideBar,
  mainSideBarState,
  scrollState,
  getSelectedType,
  cropState,
  closeUploads,
  backgroundChange,
  backgroundColorChange,
} from "../../Actions/canvasActions.js";
import {
  deselectAll,
  setTextColor,
  setCanvasBackground,
  setCanvasBackgroundImg,
  addBigHeading,
  applyFiltersOnImage,
  setBrightness,
  setContrast,
  setSaturation,
  setBlur,
  setHueRotation,
  resetAll,
  cancelCrop,
} from "./Handlers/Handlers.js";
import {
  getGiphy,
  giphySearch,
  exportEmptyData,
  getUserUploadImage,
} from "../../Actions/sidebarActions.js";
import YourDesign from "./subSections/YourDesign";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarExpand: true,
      template: true,
      uploads: false,
      photos: false,
      elements: false,
      text: false,
      videos: false,
      background: false,
      folders: false,
      more: false,
      activeClass: "temp",
      backgroundColor: "",
      imgUrl: "",
      text: "",
      canvas: "",
      show2ndSideBar: false,
      showColor: false,
      textColor: "#ffffff",
      showFilters: false,
      id: 1,
      value: 60,
      showIntensity: false,
      objType: "",
      lineSpace: 10,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      showAdjust: false,
      hue: 0,
      yourdesign: false,
      activeIndex: -1,
      page: 1,
      scrolling: false,
      giphy: false,
      giphyList: [],
      filterNum: -1,
      uploadsData: {},
      imageList: [],
      giphyFirstTwo: [],
      cropActive: false,
    };
  }

  componentDidMount() {
    let formData = {
      page: 0,
    };

    // console.log("1");
    this.props.getGiphy(formData);

    this.props.getUserUploadImage();
  }

  handleSidebar = (section) => {
    let formData = {
      fileMenu: false,
      showDownload: false,
    };
    let name = section;
    this.props.emptyData();
    let canvas = this.state.canvas;
    if (name === "temp") {
      this.setState({
        template: true,
        uploads: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        activeClass: "temp",
        show2ndSideBar: false,
        showAdjust: false,
        yourdesign: false,
        giphy: false,
        page: 0,
        scrolling: false,
      });
    }

    if (name === "uploads") {
      this.setState({
        uploads: true,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "uploads",
        show2ndSideBar: false,
        yourdesign: false,
        giphy: false,
        page: 0,
        scrolling: false,
      });
      this.props.getUserUploadImage();
      let formData = {
        page: 0,
      };
      this.props.scrollState(formData);
    }

    if (name === "photos") {
      this.setState({
        uploads: false,
        template: false,
        photos: true,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "photos",
        show2ndSideBar: false,
        yourdesign: false,
        page: 1,
        scrolling: false,
        giphy: false,
      });
      let formData = {
        scrolling: false,
      };

      this.props.scrollState(formData);
      this.props.exportEmptyData();
    }

    if (name === "elements") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: true,
        text: false,
        videos: false,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "elements",
        show2ndSideBar: false,
        yourdesign: false,
        page: 0,
        scrolling: false,
        giphy: false,
      });
    }

    if (name === "text") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: true,
        videos: false,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "text",
        show2ndSideBar: false,
        yourdesign: false,
        giphy: false,
      });
      //this.props.getCanvas(canvas);
    }

    if (name === "videos") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: true,
        background: false,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "videos",
        show2ndSideBar: false,
        giphy: false,
        yourdesign: false,
      });
    }

    if (name === "background") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: true,
        folders: false,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "background",
        show2ndSideBar: false,
        yourdesign: false,
        page: 1,
        scrolling: false,
        giphy: false,
      });
    }

    if (name === "folders") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: true,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "folders",
        show2ndSideBar: false,
        yourdesign: false,
      });
    }

    if (name === "yourdesign") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        yourdesign: true,
        more: false,
        showFilters: false,
        showAdjust: false,
        activeClass: "yourdesign",
        show2ndSideBar: false,
        folders: false,
        giphy: false,
      });
    }

    if (name === "more") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: false,
        show2ndSideBar: false,
        showFilters: false,
        more: true,
        showAdjust: false,
        activeClass: "more",
        yourdesign: false,
        giphy: false,
      });
    }
    if (name === "giphy") {
      this.setState({
        uploads: false,
        template: false,
        photos: false,
        elements: false,
        text: false,
        videos: false,
        background: false,
        folders: false,
        show2ndSideBar: false,
        showFilters: false,
        more: false,
        showAdjust: false,
        activeClass: "giphy",
        yourdesign: false,
        giphy: true,
      });
    }
    this.props.cropState(false);
    this.props.showAdjustments(false);
    this.props.headerMenu(formData);
    this.handleToolBarShowHide();
    this.props.getCanvas(canvas);
    cancelCrop(canvas);
    this.setState({ sidebarExpand: true });
    this.props.mainSideBarState(true);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    //console.log(props);
    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas;

      if (
        props.sidebarExpand !== undefined &&
        props.sidebarExpand !== state.sidebarExpand &&
        props.sidebarExpandDate !== state.sidebarExpandDate
      ) {
        if (props.showSidebar2 == true || props.showFilters == true) {
          returnState.sidebarExpand = false;
        } else {
          returnState.sidebarExpand = props.sidebarExpand;
        }

        returnState.sidebarExpandDate = props.sidebarExpandDate;
        returnState.showColor = false;
      }
      let canvas = props.canvas ? props.canvas : "";
      let activeIndexInner = props.objectIndex;
      if (returnState.activeIndex !== props.objectIndex) {
        returnState.activeIndex = props.objectIndex;
      }
      if (activeIndexInner > -1) {
        let objectData = canvas.toObject();
        let objectList = objectData.objects;
        objectList.map((obj, id) => {
          // updating object state as per obj values
          if (id === activeIndexInner) {
            if (obj && obj.filters) {
              obj.filters.length > 0 &&
                obj.filters.map((objx, idx) => {
                  if (objx.type == "Brightness") {
                    returnState.brightness =
                      parseFloat(objx.brightness, 10) * 10;
                  } else if (objx.type == "Contrast") {
                    returnState.contrast = parseFloat(objx.contrast, 10) * 10;
                  } else if (objx.type == "Saturation") {
                    returnState.saturation =
                      parseFloat(objx.saturation, 10) * 10;
                  } else if (objx.type == "Blur") {
                    returnState.blur = parseFloat(objx.blur, 10) * 10;
                  } else if (objx.type == "HueRotation") {
                    returnState.hue = parseFloat(objx.rotation, 10) * 10;
                  }
                  if (objx && objx.type == "Sepia") {
                    returnState.filterNum = 1;
                  }
                  if (objx && objx.type == "Kodachrome") {
                    returnState.filterNum = 6;
                  }
                  if (objx && objx.type == "Blur") {
                    returnState.filterNum = 8;
                  }
                  if (objx && objx.type == "Grayscale") {
                    returnState.filterNum = 0;
                  }
                  if (objx && objx.type == "Brownie") {
                    returnState.filterNum = 5;
                  }
                  if (objx && objx.type == "Technicolor") {
                    returnState.filterNum = 4;
                  }
                  if (objx && objx.type == "Vintage") {
                    returnState.filterNum = 3;
                  }

                  // /console.log(objx);
                });
              if (obj && obj.filters.length <= 0) {
                returnState.brightness = 0;
                returnState.contrast = 0;
                returnState.saturation = 0;
                returnState.blur = 0;
                returnState.hue = 0;
                returnState.filterNum = -1;
              }
            }
          }
        });
      }
    }
    if (
      props.showSidebar2 !== undefined &&
      props.showSidebar2 !== state.showSidebar2
    ) {
      returnState.showSidebar2Date = props.showSidebar2Date;
      returnState.show2ndSideBar = props.showSidebar2;
      //returnState.sidebarExpand = true;
      //returnState.showFilters = false;

      if (returnState.show2ndSideBar) {
        returnState.showFilters = false;
        returnState.sidebarExpand = false;
      }
    }
    if (
      props.showFilters !== undefined &&
      props.showFilters !== "" &&
      props.showFilters !== state.showFilters
    ) {
      returnState.showFilters = props.showFilters;
      //returnState.filterNum = -1;
      returnState.sidebarExpand = false;
      returnState.show2ndSideBar = false;
      if (returnState.showFilters == true) {
        returnState.sidebarExpand = false;
        returnState.show2ndSideBar = false;
      }
      if (returnState.showFilters == false) {
        returnState.sidebarExpand = true;
        returnState.show2ndSideBar = false;
        returnState.showFilters = false;
      }

      returnState.showSidebar2Date = props.showSidebar2Date;
    }

    if (props.objType == undefined || props.objType == "") {
      if (props.objType == "") {
        returnState.showAdjust = false;
      }
      if (props.objType == "textbox" && props.showSidebar2) {
        returnState.show2ndSideBar = props.showSidebar2;
      } else {
        returnState.showFilters = false;
        returnState.show2ndSideBar = false;
        returnState.showAdjust = false;
      }
    }

    if (
      props.objType !== undefined &&
      props.objType !== state.objType &&
      props.showSidebar2Date !== state.showSidebar2Date
    ) {
      returnState.objType = props.objType ? props.objType : "";
      if (returnState.objType == "textbox") {
        if (props.showSidebar2 == true) {
          returnState.sidebarExpand = false;
          returnState.show2ndSideBar = props.showSidebar2;
        } else {
          returnState.showFilters = false;
          returnState.sidebarExpand = true;
          returnState.show2ndSideBar = false;
        }
      }

      if (returnState.objType == "image") {
        returnState.show2ndSideBar = false;
        returnState.showColor = false;
        if (props.showFilters == true) {
          returnState.sidebarExpand = false;
        }
        returnState.sidebarExpand = true;
        returnState.showFilters = false;
      }
    }
    if (
      props.showAdjust !== undefined &&
      props.showAdjust !== state.showAdjust
    ) {
      //console.log(props);
      returnState.showAdjust = props.showAdjust;
      if (returnState.showAdjust == true) {
        returnState.sidebarExpand = false;
        returnState.show2ndSideBar = false;
      }
      if (returnState.showAdjust == false) {
        returnState.sidebarExpand = true;
        returnState.showAdjust = false;
      }
    }
    if (props.loadMore !== undefined && props.loadMore !== state.loadMore) {
      returnState.loadMore = props.loadMore;
      if (returnState.loadMore.scrolling == true) {
        returnState.scrolling = false;
      }
    }

    if (
      props.ghipyData !== undefined &&
      state.giphyList &&
      state.giphyList.length == 0
    ) {
      let firstTwo = []; // for outer two element in the list
      returnState.giphyList = props.ghipyData;
      if (props.ghipyData && props.ghipyData.length) {
        props.ghipyData.map((obj, id) => {
          if (id < 2) {
            firstTwo.push(obj);
          }
        });
      }
      returnState.giphyFirstTwo = firstTwo;
    }

    if (
      props.uploadsData !== undefined &&
      props.uploadsData.status == "200" &&
      props.uploadsData !== state.uploadsData
    ) {
      //props.exportEmptyData();
      returnState.uploadsData = props.uploadsData;
      returnState.imageList = props.uploadsData ? props.uploadsData.data : [];
    }

    if (
      props.cropActive !== undefined &&
      props.cropActive !== state.cropActive
    ) {
      returnState.cropActive = props.cropActive;
    }

    return returnState;
  }

  componentDidUpdate(prevProps, prevState) {
    let canvas = this.state.canvas;
  }

  hideSideBar = () => {
    this.setState({ sidebarExpand: false });
    this.props.mainSideBarState(false);
  };

  changeBackgroundColor = (color) => {
    let canvas = this.state.canvas;
    setCanvasBackground(canvas, color);
    let backgroundColor = color;
    this.setState({ backgroundColor: backgroundColor, imgUrl: "" });
    setTimeout(() => {
      this.props.getCanvas(canvas);
      this.props.backgroundColorChange(true);
    }, 1000);
    //console.log(color);
    // this.props.setBackground(color, "");
  };

  changeBackgroundImg = (imgUrl) => {
    let canvas = this.state.canvas;
    let backgroundImg = imgUrl;
    setCanvasBackgroundImg(canvas, imgUrl);
    this.setState({ imgUrl: backgroundImg, backgroundColor: "" });
    setTimeout(() => {
      this.props.backgroundChange(true);
      this.props.getCanvas(canvas);
    }, 1000);
  };

  //Adding text to the canvas
  addHeading = (text) => {
    let font = 30;
    if (text == "Add a heading") {
      font = 55;
    }
    if (text == "Add a subheading") {
      font = 40;
    }
    if (text == "Add a litle bit of body text heading") {
      font = 20;
    }
    let canvas = this.state.canvas;
    let textData = text;
    let id = this.state.id + 10;
    addBigHeading(canvas, textData, id, font);
    this.setState({ text: textData });
    this.props.getSelectedType("textbox");
    //this.props.addHeadingData(text);
  };
  //adding text canvas end

  deSelect = () => {
    let canvas = this.state.canvas;
    deselectAll(canvas);
  };

  handleColorPalette = () => {
    this.setState({ showColor: !this.state.showColor, sidebarExpand: false });
    if (this.state.showColor == true) {
      this.props.mainSideBarState(true);
    } else {
      this.props.mainSideBarState(false);
    }
  };

  handleChangeColorComplete = (color) => {
    let canvas = this.state.canvas;

    setTextColor(canvas, color.hex);
    this.setState({ textColor: color.hex });
    //this.props.changeTextColor(color.hex);
  };

  changeTextColor = (value) => {
    let canvas = this.state.canvas;
    setTextColor(canvas, value);
    this.setState({ textColor: value });
  };

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChange = (value) => {
    let canvas = this.props.canvas;
    this.setState({
      value: value,
    });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
  };

  handleFilters = (value) => {
    this.setState({ filterNum: value });
    let canvas = this.props.canvas;
    applyFiltersOnImage(canvas, value);
    setTimeout(() => this.props.getCanvas(this.props.canvas), 0);
  };
  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChangeLineSpace = (value) => {
    let canvas = this.props.canvas;
    //setLetterSpacing(canvas, value);
    this.setState({
      lineSpace: value,
    });
  };

  //Handle Adjustment functions

  handleChangeBrightness = (value) => {
    let canvas = this.state.canvas;
    let finalValue = value / 10;
    setBrightness(canvas, finalValue);
    this.setState({
      brightness: parseFloat(value, 10),
    });
    this.props.mainSideBarState(false);
  };

  handleChangeContrast = (value) => {
    let canvas = this.state.canvas;
    let finalValue = value / 10;
    setContrast(canvas, finalValue);
    this.setState({
      contrast: parseFloat(value, 10),
    });
    this.props.mainSideBarState(false);
  };

  handleChangeSaturation = (value) => {
    let canvas = this.state.canvas;
    let finalValue = value / 10;
    setSaturation(canvas, finalValue);
    this.setState({
      saturation: parseFloat(value, 10),
    });
    this.props.mainSideBarState(false);
  };

  handleChangeBlur = (value) => {
    let canvas = this.props.canvas;
    let finalValue = value / 10;
    setBlur(canvas, finalValue);
    this.setState({
      blur: parseFloat(value, 10),
    });
    this.props.mainSideBarState(false);
  };
  handleChangeHue = (value) => {
    let canvas = this.props.canvas;
    let finalValue = value / 10;
    setHueRotation(canvas, finalValue);
    this.setState({
      hue: parseFloat(value, 10),
    });
    this.props.mainSideBarState(false);
  };

  resetFilters = () => {
    let canvas = this.state.canvas;
    this.setState({
      hue: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      filterNum: -1,
    });
    resetAll(canvas);
    this.props.mainSideBarState(false);
    this.setState({ filterNum: -1 });
  };

  // Adjustments functions end

  handleToolBarShowHide = () => {
    let formData = {
      showOpacity: false,
      showPositionDropdown: false,
      showLine: false,
      showFlip: false,
    };

    this.props.toolsMenu(formData);
  };

  handleScroll = (e) => {
    let element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (this.state.photos == true && this.state.activeClass == "photos") {
        // managing scroll position for pagination
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          photos: this.state.photos,
          elements: this.state.elements,
          videos: this.state.videos,
          template: false,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }

      if (this.state.template == true && this.state.activeClass == "temp") {
        // managing scroll position for pagination
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          template: this.state.template,
          elements: this.state.elements,
          videos: this.state.videos,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }

      if (this.state.elements == true && this.state.activeClass == "elements") {
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          photos: this.state.photos,
          videos: this.state.videos,
          elements: this.state.elements,
          template: false,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }

      if (
        this.state.background == true &&
        this.state.activeClass == "background"
      ) {
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          photos: this.state.photos,
          elements: this.state.elements,
          background: this.state.background,
          videos: this.state.videos,
          template: false,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }
      if (this.state.giphy == true && this.state.activeClass == "giphy") {
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          photos: this.state.photos,
          elements: this.state.elements,
          background: this.state.background,
          giphy: this.state.giphy,
          videos: this.state.videos,
          template: false,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }

      if (this.state.videos == true && this.state.activeClass == "videos") {
        // managing scroll position for pagination
        let formData = {
          page: this.state.page + 1,
          scrolling: true,
          photos: this.state.photos,
          elements: this.state.elements,
          giphy: this.state.giphy,
          template: false,
          videos: this.state.videos,
        };
        this.setState({ page: formData.page, scrolling: formData.scrolling });
        this.props.scrollState(formData);
      }
    }
  };

  render() {
    let canvas = this.state.canvas;
    let showBright =
      this.state.brightness == 0
        ? 0
        : this.state.brightness > 0
        ? this.state.brightness + 2
        : this.state.brightness < 0
        ? this.state.brightness - 2
        : 0;
    let showContrast =
      this.state.contrast == 0
        ? 0
        : this.state.contrast > 0
        ? this.state.contrast + 2
        : this.state.contrast < 0
        ? this.state.contrast - 2
        : 0;
    //console.log("render", this.state.giphyFirstTwo);
    return (
      <aside>
        <div
          className="border-left-icons"
          id={
            this.state.sidebarExpand ||
            this.state.show2ndSideBar ||
            this.state.showFilters ||
            this.state.showAdjust
              ? "sidebar-icons"
              : "hiddenSidebar"
          }
        >
          <div className="sidebar-menu">
            <nav>
              <ul className="left-icons-list">
                <li onClick={(e) => this.handleSidebar("temp")}>
                  <a
                    className={
                      this.state.activeClass == "temp" ? "active-catg" : ""
                    }
                  >
                    <span name={"temp"} className="d-block template"></span>
                    <span name={"temp"} className="d-block">
                      Templates
                    </span>
                  </a>
                </li>
                {
                  <li
                    name="uploads"
                    onClick={(e) => this.handleSidebar("uploads")}
                  >
                    <a
                      className={
                        this.state.activeClass == "uploads" ? "active-catg" : ""
                      }
                    >
                      <span className="d-block upload"></span>
                      <span className="d-block">Uploads</span>
                    </a>
                  </li>
                }
                <li name="photos" onClick={(e) => this.handleSidebar("photos")}>
                  <a
                    className={
                      this.state.activeClass == "photos" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block photo"></span>
                    <span className="d-block">Photos</span>
                  </a>
                </li>
                <li
                  name="elements"
                  onClick={(e) => this.handleSidebar("elements")}
                >
                  <a
                    className={
                      this.state.activeClass == "elements" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block element"></span>
                    <span className="d-block">Elements</span>
                  </a>
                </li>
                {/*<li name="giphy" onClick={(e) => this.handleSidebar("giphy")}>
                  <a
                    className={
                      this.state.activeClass == "giphy" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block stickers"></span>
                    <span className="d-block">Stickers</span>
                  </a>
                </li>*/}
                <li name="text" onClick={(e) => this.handleSidebar("text")}>
                  <a
                    className={
                      this.state.activeClass == "text" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block fonts"></span>
                    <span className="d-block">Text</span>
                  </a>
                </li>
                {
                  <li
                    name="videos"
                    onClick={(e) => this.handleSidebar("videos")}
                  >
                    <a
                      className={
                        this.state.activeClass == "videos" ? "active-catg" : ""
                      }
                    >
                      <span className="d-block videos"></span>
                      <span className="d-block">Videos</span>
                    </a>
                  </li>
                }
                <li
                  name="background"
                  onClick={(e) => this.handleSidebar("background")}
                >
                  <a
                    className={
                      this.state.activeClass == "background"
                        ? "active-catg"
                        : ""
                    }
                  >
                    <span className="d-block background"></span>
                    <span className="d-block">Background</span>
                  </a>
                </li>
                <li
                  name="folders"
                  onClick={(e) => this.handleSidebar("yourdesign")}
                >
                  <a
                    className={
                      this.state.activeClass == "yourdesign"
                        ? "active-catg"
                        : ""
                    }
                  >
                    <span className="d-block folder"></span>
                    <span className="d-block">My Designs</span>
                  </a>
                </li>
                {/*<li
                  name="folders"
                  onClick={(e) => this.handleSidebar("folders")}
                >
                  <a
                    className={
                      this.state.activeClass == "folder" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block folder"></span>
                    <span className="d-block">Folders</span>
                  </a>
                </li>*/}
                {/* <li name="more" onClick={(e) => this.handleSidebar("more")}>
                  <a
                    className={
                      this.state.activeClass == "more" ? "active-catg" : ""
                    }
                  >
                    <span className="d-block more"></span>
                    <span className="d-block">More</span>
                  </a>
                </li>*/}
              </ul>
            </nav>
          </div>
          {/*---------2nd SideBar Started---------*/}
          {this.state.show2ndSideBar && (
            <div className="color-box-section">
              {/* <div className="row search-box mt-4">
                <div className="col-md-12 col-sm-12">
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
                      type="search"
                      placeholder="Try red or #ff0000"
                      aria-describedby="button-addon4"
                      className="form-control bg-none border-0"
                    />
                  </div>
                </div>
              </div>*/}

              <div className="row color-box mt-4">
                <div className="col-md-12 col-sm-12">
                  <h3>New color</h3>
                </div>
                <div className="col-md-12 col-sm-12">
                  <ul className="new-color-ul">
                    <li>
                      <img
                        src="/img/colorwheel.webp"
                        onClick={this.handleColorPalette}
                      />
                      {this.state.showColor && (
                        <ChromePicker
                          color={this.state.textColor}
                          onChangeComplete={this.handleChangeColorComplete}
                        />
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              {
                <div className="row color-box mt-4">
                  <div className="col-md-12 col-sm-12">
                    <h3>Document colors</h3>
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <ul className="document-color-ul">
                      <li
                        style={{
                          background: this.state.textColor,
                        }}
                      ></li>
                    </ul>
                  </div>
                </div>
              }

              {/*<div className="row color-box mt-4">
                <div className="col-md-12 col-sm-12">
                  <h3>Photo colors</h3>
                  <a href="#" className="see-all">
                    See all
                  </a>
                </div>
                <div className="col-md-12 col-sm-12">
                  <ul className="document-color-ul">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                  <ul className="document-color-ul">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                  <ul className="document-color-ul">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>*/}

              <div className="row color-box mt-4">
                <div className="col-md-12 col-sm-12">
                  <h3>Default color</h3>
                </div>
                <div className="col-md-12 col-sm-12">
                  <ul className="default-color-ul">
                    <li
                      style={{ background: "#ffffff" }}
                      onClick={() => this.changeTextColor("#ffffff")}
                    ></li>
                    <li
                      style={{ background: "#7c677f" }}
                      onClick={() => this.changeTextColor("#7c677f")}
                    ></li>
                    <li
                      style={{ background: "#39a0ca" }}
                      onClick={() => this.changeTextColor("#39a0ca")}
                    ></li>
                    <li
                      style={{ background: "#ff414e" }}
                      onClick={() => this.changeTextColor("#ff414e")}
                    ></li>
                    <li
                      style={{ background: "#007f4f" }}
                      onClick={() => this.changeTextColor("#007f4f")}
                    ></li>
                    <li
                      style={{ background: "#d9d9d9" }}
                      onClick={() => this.changeTextColor("#d9d9d9")}
                    ></li>
                  </ul>
                  <ul className="default-color-ul">
                    <li
                      style={{ background: "#293233" }}
                      onClick={() => this.changeTextColor("#293233")}
                    ></li>
                    <li
                      style={{ background: "#1ca69d" }}
                      onClick={() => this.changeTextColor("#1ca69d")}
                    ></li>
                    <li
                      style={{ background: "#c13e72" }}
                      onClick={() => this.changeTextColor("#c13e72")}
                    ></li>
                    <li
                      style={{ background: "#44adbb" }}
                      onClick={() => this.changeTextColor("#44adbb")}
                    ></li>
                    <li
                      style={{ background: "#f9ccaa" }}
                      onClick={() => this.changeTextColor("#f9ccaa")}
                    ></li>
                    <li
                      style={{ background: "#4b072c" }}
                      onClick={() => this.changeTextColor("#4b072c")}
                    ></li>
                  </ul>
                  <ul className="default-color-ul">
                    <li
                      style={{ background: "#6c7093" }}
                      onClick={() => this.changeTextColor("#6c7093")}
                    ></li>
                    <li
                      style={{ background: "#99b34d" }}
                      onClick={() => this.changeTextColor("#99b34d")}
                    ></li>
                    <li
                      style={{ background: "#b35ba0" }}
                      onClick={() => this.changeTextColor("	#b35ba0")}
                    ></li>
                    <li
                      style={{ background: "#1b1452" }}
                      onClick={() => this.changeTextColor("#1b1452")}
                    ></li>
                    <li
                      style={{ background: "#d6ffe8" }}
                      onClick={() => this.changeTextColor("#d6ffe8")}
                    ></li>
                    <li
                      style={{ background: "#fb4204" }}
                      onClick={() => this.changeTextColor("#fb4204")}
                    ></li>
                  </ul>
                  <ul className="default-color-ul">
                    <li
                      style={{ background: "#6f8b90" }}
                      onClick={() => this.changeTextColor("#6f8b90")}
                    ></li>
                    <li
                      style={{ background: "#f2d53c" }}
                      onClick={() => this.changeTextColor("#f2d53c")}
                    ></li>
                    <li
                      style={{ background: "#c80e13" }}
                      onClick={() => this.changeTextColor("#c80e13")}
                    ></li>
                    <li
                      style={{ background: "#e1b382" }}
                      onClick={() => this.changeTextColor("#e1b382")}
                    ></li>
                    <li
                      style={{ background: "#2d545e" }}
                      onClick={() => this.changeTextColor("#2d545e")}
                    ></li>
                    <li
                      style={{ background: "#ff5e6c" }}
                      onClick={() => this.changeTextColor("#ff5e6c")}
                    ></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {this.state.showAdjust && (
            <div className="adjustment-box-section">
              <div className="row mt-4">
                <div className="col-md-12 col-sm-12">
                  <h3>Adjustments</h3>
                  <a
                    className="float-right"
                    onClick={() => this.resetFilters()}
                  >
                    Reset
                  </a>
                </div>
                <div className="col-md-12 col-sm-12">
                  <hr />
                </div>

                <div className="col-md-12 col-sm-12 mt-3 mb-3">
                  <div className="adjust-box">
                    <span className="d-inline">{"Brightness"}</span>
                    <span className="d-inline rang-span">
                      <Slider
                        min={-8}
                        max={8}
                        value={this.state.brightness}
                        onChange={this.handleChangeBrightness}
                        tooltip={false}
                        step={1}
                      />
                    </span>
                    <span className="range-input">
                      <input
                        type="text"
                        placeholder="--"
                        value={showBright}
                        onChange={this.handleInputChange}
                        name="brightness"
                        disabled
                      />
                    </span>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 mb-3">
                  <div className="adjust-box">
                    <span className="d-inline">{"Contrast"}</span>
                    <span className="d-inline rang-span">
                      <Slider
                        min={-8}
                        max={8}
                        value={this.state.contrast}
                        onChange={this.handleChangeContrast}
                        tooltip={false}
                        step={1}
                      />
                    </span>
                    <span className="range-input">
                      <input
                        type="text"
                        placeholder="--"
                        value={showContrast}
                        onChange={this.handleInputChange}
                        name="contrast"
                        disabled
                      />
                    </span>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 mb-3">
                  <div className="adjust-box">
                    <span className="d-inline">{"Saturation"}</span>
                    <span className="d-inline rang-span">
                      <Slider
                        min={-10}
                        max={10}
                        value={this.state.saturation}
                        onChange={this.handleChangeSaturation}
                        tooltip={false}
                        step={1}
                        disabled
                      />
                    </span>
                    <span className="range-input">
                      <input
                        type="text"
                        placeholder="--"
                        value={this.state.saturation}
                        onChange={this.handleInputChange}
                        name="saturation"
                        disabled
                      />
                    </span>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 mb-3">
                  <div className="adjust-box">
                    <span className="d-inline">{"Blur"}</span>
                    <span className="d-inline rang-span">
                      <Slider
                        min={0}
                        max={10}
                        value={this.state.blur}
                        onChange={this.handleChangeBlur}
                        tooltip={false}
                        step={1}
                        disabled
                      />
                    </span>
                    <span className="range-input">
                      <input
                        type="text"
                        placeholder="--"
                        value={this.state.blur}
                        onChange={this.handleInputChange}
                        name="blur"
                        disabled
                      />
                    </span>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 mb-3">
                  <div className="adjust-box">
                    <span className="d-inline">{"Hue"}</span>
                    <span className="d-inline rang-span">
                      <Slider
                        min={-10}
                        max={10}
                        value={this.state.hue}
                        onChangeStart={this.handleChangeStart}
                        onChange={this.handleChangeHue}
                        onChangeComplete={this.handleChangeComplete}
                        tooltip={false}
                        step={1}
                        disabled
                      />
                    </span>
                    <span className="range-input">
                      <input
                        type="text"
                        placeholder="--"
                        value={this.state.hue}
                        onChange={this.handleInputChange}
                        name="hue"
                        disabled
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {this.state.showFilters && (
            <div className="filters-box-section">
              <div className="row mt-4">
                <div className="col-md-12 col-sm-12">
                  <h3>Filters</h3>
                </div>
                <div className="col-md-12 col-sm-12">
                  <hr />
                </div>
                <div className="col-md-12 col-sm-12">
                  <ul className="filers-ul">
                    <li>
                      <button type="button" onClick={() => this.resetFilters()}>
                        <span
                          className={
                            this.state.filterNum == -1
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">None</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(3)}
                      >
                        <span
                          className={
                            this.state.filterNum == 3
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Epic</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(4)}
                      >
                        <span
                          className={
                            this.state.filterNum == 4
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Festive</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(5)}
                      >
                        <span
                          className={
                            this.state.filterNum == 5
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Summer</span>
                      </button>
                    </li>
                    {this.state.showIntensity && (
                      <li className="w-100 filter-percentage">
                        <span className="d-inline">Intensity</span>
                        <span className="d-inline rang-span">
                          <Slider
                            min={0}
                            max={100}
                            value={this.state.value}
                            onChangeStart={this.handleChangeStart}
                            onChange={this.handleChange}
                            onChangeComplete={this.handleChangeComplete}
                            tooltip={false}
                          />
                        </span>
                        <span className="range-input">
                          <input
                            type="text"
                            placeholder="--"
                            value={this.state.value}
                            onChange={this.handleChange}
                            disabled
                          />
                        </span>
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(0)}
                      >
                        <span
                          className={
                            this.state.filterNum == 0
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Greyscale</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(8)}
                      >
                        <span
                          className={
                            this.state.filterNum == 8
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Blur</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(6)}
                      >
                        <span
                          className={
                            this.state.filterNum == 6
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Peony</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => this.handleFilters(1)}
                      >
                        <span
                          className={
                            this.state.filterNum == 1
                              ? "img-box active-border"
                              : "img-box"
                          }
                        >
                          <img src="/img/car1.jpg" />
                        </span>
                        <span className="text-box text-center">Sepia</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {/*------------2nd SideBar end-------------- */}
          {this.state.sidebarExpand && (
            <div
              className="rights-section-poster hidden-section"
              onScroll={this.handleScroll}
            >
              {/*<!-------Templates SECTION----> */}

              {this.state.template ? <Templates /> : ""}

              {/*<!-------Uploads SECTION---->*/}

              {this.state.uploads ? (
                <Uploads imageList={this.state.imageList} />
              ) : (
                ""
              )}

              {/*<!-------Photo SECTION---->*/}

              {this.state.photos ? <Photos /> : ""}

              {/*<!-------Elements SECTION---->*/}

              {this.state.elements ? (
                <Elements
                  stickers={this.state.giphyList}
                  firstTwo={this.state.giphyFirstTwo}
                />
              ) : (
                ""
              )}

              {this.state.giphy ? (
                <GiphySection list={this.state.giphyList} />
              ) : (
                ""
              )}
              {/*<!-------Text SECTION---->*/}

              {this.state.text ? (
                <TextSection
                  addHeading={(text) => {
                    this.addHeading(text);
                  }}
                />
              ) : (
                ""
              )}

              {/*<!-------Videos SECTION---->*/}

              {this.state.videos ? <Videos /> : ""}

              {/*<!-------Background SECTION---->*/}

              {this.state.background ? (
                <Background
                  changeBackgroundColor={(color) =>
                    this.changeBackgroundColor(color)
                  }
                  backgroundColor={this.state.backgroundColor}
                  changeBackgroundImg={(imgUrl) =>
                    this.changeBackgroundImg(imgUrl)
                  }
                />
              ) : (
                ""
              )}

              {/*<!-------folder SECTION---->*/}

              {this.state.folders ? <Folders /> : ""}

              {this.state.yourdesign ? <YourDesign /> : ""}
            </div>
          )}

          {/*<!------hidden arrow------>*/}
          <div
            className={this.state.sidebarExpand ? "hide-arrow" : "noDisplay"}
            onClick={this.hideSideBar}
          >
            <img src="/img/hide-arrow.svg" />
          </div>
        </div>
      </aside>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  const data = state.CanvasReducer;
  // console.log(data);
  if (data) {
    returnState.objectIndex = data.objectIndex;
    returnState.canvas = data.canvasData;
    returnState.showSidebar2 = data.showSidebar2;
    returnState.showSidebar2Date = new Date();
    returnState.showFilters = data.filters;
    returnState.objType = data ? data.objectType : "";
    returnState.showAdjust = data ? data.showAdjust : "";
    returnState.sidebarExpand = data ? data.mainSidebar : false;
    returnState.sidebarExpandDate = new Date();
    returnState.loadMore = data ? data.scrollData : {};
    returnState.isUpload = data ? data.isUpload : false;
    returnState.isBackground = data ? data.isBackground : false;
    returnState.isBackgroundColor = data ? data.isBackgroundColor : false;
    returnState.isUploadDate = new Date();
    returnState.cropActive = data.cropState ? data.cropState : false;
  }
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

  if (state.SidebarReducer.action == "GET_USER_UPLOAD_IMAGE") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data);
      returnState.uploadsData = state.SidebarReducer.data;
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setBackground: setBackground,
      addHeadingData: addHeadingData,
      emptyData: emptyData,
      headerMenu: headerMenu,
      showAdjustments: showAdjustments,
      toolsMenu: toolsMenu,
      getCanvas: getCanvas,
      mainSideBarState: mainSideBarState,
      scrollState: scrollState,
      getSelectedType: getSelectedType,
      getGiphy: getGiphy,
      cropState: cropState,
      exportEmptyData: exportEmptyData,
      getUserUploadImage: getUserUploadImage,
      closeUploads: closeUploads,
      backgroundChange: backgroundChange,
      backgroundColorChange: backgroundColorChange,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Sidebar));
