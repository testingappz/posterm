import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import VideoThumbnail from "reactautoplay";
import Masonry from "react-masonry-css";
//import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";
// /import VideoThumbnail from 'react-video-thumbnail';

import {
  addImage,
  addUploadImage,
  addVideo,
  getVideoElement,
  setCanvasBackgroundImg,
} from "../Handlers/Handlers.js";
import {
  scrollState,
  getSelectedType,
  closeUploads,
} from "../../../Actions/canvasActions.js";
import {
  uploadUserImage,
  getUserUploadImage,
  deleteUserImageUploads,
  exportEmptyData,
  uploadUserVideo,
  getUserVideos,
  deleteUserVideoUploads,
} from "../../../Actions/sidebarActions.js";
//import VideoThumbnail from "react-video-thumbnail";

class Uploads extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("useMe"));
    this.inputOpenFileRef = React.createRef();
    this.state = {
      cg: this.props.match.params.cg,
      file: "",
      userId: user ? user._id : "",
      userEmail: user ? user.email : "",
      uploadsData: {},
      imageList: [],
      canvas: "",
      viewImages: true,
      viewVideos: false,
      viewTab: "images",
      videoUploads: {},
      videoList: [],
      showLoader: false,
      isUploading: false,
    };
  }

  componentDidMount() {
    let list = this.props.imageList;

    if (list && list.length) {
      this.setState({ imageList: list });
    }
    // console.log(imageList);

    this.props.getUserVideos();
    // this.props.getUserUploadImage();
  }

  handleClick(e) {
    //console.log("in");
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    //props.exportEmptyData();
    if (
      props.canvas !== undefined &&
      props.canvas !== "" &&
      props.canvas !== state.canvas
    ) {
      returnState.canvas = props.canvas;
    }
    if (
      props.uploadsData !== undefined &&
      props.uploadsData.status == "200" &&
      props.uploadsData !== state.uploadsData
    ) {
      //props.exportEmptyData();
      returnState.uploadsData = props.uploadsData;

      //console.log(props.uploadsData.data);
      returnState.imageList = props.uploadsData ? props.uploadsData.data : [];

      if (returnState.imageList && returnState.imageList.length) {
        let list = returnState.imageList;

        returnState.imageList = list;
      }
      if (props.uploadImage == true) {
        returnState.viewImages = true;
        //returnState.imageList = returnState.imageList.reverse();
        // console.log(props.uploadImage);
        props.closeUploads(false);
        returnState.viewVideos = false;
        returnState.viewTab = "images";
        returnState.showLoader = false;
      }
      if (props.deletedSuccess == true) {
        //console.log("change");
        //returnState.imageList = returnState.imageList.reverse();
      }
    }

    if (
      props.videoUploads !== undefined &&
      props.videoUploads.status == "200" &&
      props.videoUploads !== state.videoUploads
    ) {
      let sortedArray = [];
      //console.log("in");
      returnState.videoUploads = props.videoUploads;
      if (props.videoUploads && props.videoUploads.data) {
        //props.videoUploads.data.map((obj, id));
      }

      if (props.uploadedVideo == true) {
        returnState.viewVideos = true;
        returnState.viewImages = false;
        returnState.showLoader = false;
        props.closeUploads(true);
        returnState.viewTab = "video";
      }

      returnState.videoList = props.videoUploads ? props.videoUploads.data : [];
      if (returnState.videoList && returnState.videoList.length) {
        // returnState.videoList.reverse();
      }
    }

    if (props.isUpload !== undefined && props.isUpload !== state.isUpload) {
      returnState.isUploadDate = props.isUploadDate;
      if (props.isUpload == false) {
        returnState.viewTab = "images";
        returnState.isUploading = false;
      }
      if (props.isUpload == true) {
        //console.log("lolwas");
        returnState.viewTab = "video";
        returnState.isUploading = false;
      }
    }
    return returnState;
  }

  _handleImageChange(e) {
    e.preventDefault();
    let binaryData;
    let data;
    let binaryBlob;
    let file = e.target.files[0];
    if (file && file.size > 50000000) {
      alert("File is too big!"); // file limit
      return;
    }
    let extension = file ? file.name.split(".").pop() : "";
    this.setState({ file: file });
    if (extension == "png" || extension == "jpg" || extension == "jpeg") {
      // if file is image
      let reader = new FileReader();
      reader.onloadend = () => {
        binaryData = reader.result; // Encoded Base 64 File String

        data = reader.result.split(",")[1];
        binaryBlob = atob(data);
      };

      if (file) {
        reader.readAsDataURL(file);
      }

      if (file) {
        let form_data = new FormData();
        form_data.append("image", file);
        form_data.append("userId", this.state.userId);
        form_data.append("category", "user upload");
        this.setState({ showLoader: true, isUploading: true });
        this.props.exportEmptyData();
        this.props.uploadUserImage(form_data);
      }
    } else {
      if (file) {
        if (extension == "mp4" || extension == "mov" || extension == "webm") {
          let form_data = new FormData();
          form_data.append("video", file);
          form_data.append("userId", this.state.userId);
          form_data.append("category", "user upload");
          this.setState({ showLoader: true, isUploading: true });
          this.props.uploadUserVideo(form_data);
        } else {
          alert("File not supported!");
        }
      }

      //console.log(file);
    }
  }

  handleDelete = (id) => {
    if (id) {
      this.props.deleteUserImageUploads(id);
    }
  };

  handleDeleteVideo = (id) => {
    if (id) {
      this.props.deleteUserVideoUploads(id);
    }
  };

  addImageToCanvas = (url) => {
    if (
      this.state.userEmail &&
      this.state.userEmail === "testingadmin@yopmail.com"
    ) {
      let canvas = this.state.canvas;
      let cg = this.state.cg ? this.state.cg : "";
      setCanvasBackgroundImg(canvas, url, cg);
      // this.props.getSelectedType("image");
    } else {
      let canvas = this.state.canvas;
      let cg = this.state.cg ? this.state.cg : "";
      addUploadImage(canvas, url, cg);
      this.props.getSelectedType("image");
    }
  };

  addVideoToCanvas = (url) => {
    let canvas = this.state.canvas;
    //addVideo(canvas, url);
    getVideoElement(canvas, url);
    //this.props.addVideo()
  };

  showImages = () => {
    this.setState({ viewTab: "images", viewVideos: false });
    this.props.closeUploads(false);
  };

  showVideos = () => {
    this.setState({ viewTab: "video", viewImages: false });
    this.props.closeUploads(true);
  };

  setBackgroundAdmin = (url) => {
    if (
      this.state.userEmail &&
      this.state.userEmail === "testingadmin@yopmail.com"
    ) {
      let canvas = this.state.canvas;
      let cg = this.state.cg ? this.state.cg : "";
      setCanvasBackgroundImg(canvas, url, cg);
      // this.props.getSelectedType("image");
    }
  };

  uploadPhotoAdmin = (url) => {
    if (
      this.state.userEmail &&
      this.state.userEmail === "testingadmin@yopmail.com"
    ) {
      let canvas = this.state.canvas;
      let cg = this.state.cg ? this.state.cg : "";
      addUploadImage(canvas, url, cg);
      this.props.getSelectedType("image");
    }
  };

  render() {
    console.log(this.state.showLoader);
    let canvas = this.state.canvas;
    //console.log(this.state.viewTab);
    //console.log(this.state.imageList);
    return (
      <div className={"uploads-category mt-4"}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <button
              type="upload"
              className="btn btn-primary image-video w-100"
              onClick={this.showOpenFileDlg}
              disabled={this.state.isUploading ? true : false}
            >
              Upload an image or video
              <input
                type="file"
                ref={this.inputOpenFileRef}
                onChange={(e) => this._handleImageChange(e)}
                accept="image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/quicktime"
                style={{ display: "none" }}
                id="fileUpload"
              />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <ul className="nav nav-tabs mt-2" id="myTab" role="tablist">
              {
                <li className="nav-item">
                  <a
                    className={
                      this.state.viewTab == "images"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => this.showImages("images")}
                  >
                    Images
                  </a>
                </li>
              }
              {
                <li className="nav-item">
                  <a
                    className={
                      this.state.viewTab == "video"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => this.showVideos("video")}
                  >
                    Videos
                  </a>
                </li>
              }
            </ul>

            <div className="tab-content" id="myTabContent">
              {this.state.viewTab == "images" && (
                <div className="tab-pane fade show active" id="upload-images">
                  <div className="row">
                    <div className="col-md-12 col-sm-12 mt-2">
                      {this.state.imageList &&
                        this.state.imageList.length == 0 && (
                          <div className="text-no-img mt-3">
                            <span>No Image</span>
                          </div>
                        )}
                      <SyncLoader
                        size={10}
                        color={"#ffffff"}
                        loading={this.state.showLoader}
                      />
                      <Masonry
                        breakpointCols={2}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {this.state.imageList &&
                          this.state.imageList.length > 0 &&
                          this.state.imageList.map((obj, id) => {
                            // console.log(obj);
                            return (
                              <div key={id} className="myDesign">
                                <span className="">
                                  <span
                                    className="delete-btn"
                                    onClick={(id) => this.handleDelete(obj._id)}
                                  >
                                    <i
                                      className="fa fa-trash-o"
                                      aria-hidden="true"
                                    ></i>{" "}
                                  </span>

                                  <img
                                    src={obj.image_url}
                                    onClick={() =>
                                      this.addImageToCanvas(
                                        obj ? obj.image_url : ""
                                      )
                                    }
                                    crossOrigin="anonymous"
                                  />
                                </span>
                                {this.state.userEmail ===
                                  "testingadmin@yopmail.com" && (
                                  <ul>
                                    <li
                                      onClick={() =>
                                        this.setBackgroundAdmin(
                                          obj ? obj.image_url : ""
                                        )
                                      }
                                    >
                                      background
                                    </li>
                                    <li
                                      onClick={() =>
                                        this.uploadPhotoAdmin(
                                          obj ? obj.image_url : ""
                                        )
                                      }
                                    >
                                      upload
                                    </li>
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                      </Masonry>
                    </div>
                  </div>
                </div>
              )}
              {this.state.viewTab == "video" && (
                <div className="tab-pane show active">
                  <div className="row">
                    <div className="col-md-12 col-sm-12 mt-2">
                      {this.state.videoUploads &&
                        this.state.videoList &&
                        this.state.videoList.length === 0 && (
                          <div className="text-no-img mt-3">
                            <span style={{ color: "#ffffff" }}>No Video</span>
                          </div>
                        )}
                      <SyncLoader
                        size={10}
                        color={"#ffffff"}
                        loading={this.state.showLoader}
                      />
                      <Masonry
                        breakpointCols={2}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {this.state.videoUploads &&
                          this.state.videoList &&
                          this.state.videoList.length > 0 &&
                          this.state.videoList.map((obj, id) => {
                            return (
                              <div className="myDesign" key={id}>
                                <span className="">
                                  <span
                                    className="delete-btn"
                                    onClick={(id) =>
                                      this.handleDeleteVideo(obj._id)
                                    }
                                  >
                                    <i
                                      className="fa fa-trash-o"
                                      aria-hidden="true"
                                    ></i>{" "}
                                  </span>
                                  <span
                                    className=""
                                    onClick={() =>
                                      this.addVideoToCanvas(
                                        obj ? obj.video_url : ""
                                      )
                                    }
                                  >
                                    {/*<img
                                      src={obj.gif_url}
                                      crossOrigin="anonymous"
                                    />*/}
                                    {/*<GifPlayer
                                      gif={obj.gif_url}
                                      still={obj.gif_url}
                                      pauseRef={(pause) =>
                                        (this.pauseGif = pause)
                                      

                                    />*/}

                                    <video
                                      key={id}
                                      muted
                                      name="displayFor"
                                      style={{
                                        width: "100%",
                                        cursor: "pointer",
                                        height: "100%",
                                        display: "block",
                                      }}
                                      onMouseOver={(e) => e.target.play()}
                                      onMouseOut={(e) => e.target.pause()}
                                      src={obj.video_url ? obj.video_url : ""}
                                    />

                                    {/*
                                      <VideoThumbnail
                                        title=""
                                        preview={obj.video_url}
                                        //badge=""
                                        //badgeBG=""
                                        message=""
                                        muted={true}
                                        width={150}
                                        classname="customClassName"
                                      />
                                    */}
                                    {/*<VideoThumbnail
                                      videoUrl={obj.video_url}
                                      thumbnailHandler={(thumbnail) =>
                                        console.log(thumbnail)
                                      }
                                    />*/}
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                      </Masonry>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};
  //console.log(state);
  const data = state.CanvasReducer;
  if (state.CanvasReducer !== undefined) {
    returnState.canvas = state.CanvasReducer.canvasData;
    returnState.isUpload = data ? data.isUpload : false;
    returnState.isUploadDate = new Date();
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

  if (state.SidebarReducer.action == "UPLOAD_USER_IMAGE") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      returnState.uploadsData = state.SidebarReducer.data;
      //console.log(returnState.uploadsData);
      returnState.uploadImage = true;
    }
  }

  if (state.SidebarReducer.action == "DELETE_USER_UPLOAD_IMAGE") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      returnState.uploadsData = state.SidebarReducer.data;
      //console.log(returnState.uploadsData);
      returnState.deletedSuccess = true;
    }
  }

  if (state.SidebarReducer.action == "UPLOAD_USER_VIDEO") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data.data);
      returnState.videoUploads = state.SidebarReducer.data;
      returnState.uploadedVideo = true;
    }
  }

  if (state.SidebarReducer.action == "GET_USER_UPLOAD_VIDEOS") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      //console.log(state.SidebarReducer.data);
      returnState.videoUploads = state.SidebarReducer.data;
    }
  }

  if (state.SidebarReducer.action == "DELETE_USER_UPLOAD_VIDEO") {
    if (state.SidebarReducer.data.status !== "200") {
      returnState.errorData = state.SidebarReducer.data;
      returnState.errorDate = new Date();
    } else {
      // console.log(state.SidebarReducer.data);
      returnState.videoUploads = state.SidebarReducer.data;
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      uploadUserImage: uploadUserImage,
      getUserUploadImage: getUserUploadImage,
      deleteUserImageUploads: deleteUserImageUploads,
      exportEmptyData: exportEmptyData,
      getSelectedType: getSelectedType,
      uploadUserVideo: uploadUserVideo,
      getUserVideos: getUserVideos,
      deleteUserVideoUploads: deleteUserVideoUploads,
      closeUploads: closeUploads,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Uploads));
