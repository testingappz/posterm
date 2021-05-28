import React, { Component } from "react";
import validator from "validator";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { logout } from "../../Utils/services.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { v4 } from "uuid";
import { Helmet } from "react-helmet";
//import { FacebookShareButton, TwitterShareButton } from "react-share";
import copy from "copy-to-clipboard";
import { setCanvasSize, setCategory } from "../../Actions/HomeActions";
import { isFormSubmit } from "../../Utils/services.js";
import {
  getUser,
  templateSearchOuter,
  exportEmptyData,
  updateMe,
  shareFeedback,
  getLeaders,
} from "../../Actions/canvasExternalActions.js";
import NewDesign from "./HomeSections/NewDesign.js";
import RecentDesign from "./HomeSections/RecentDesign.js";
import SearchResults from "./HomeSections/SearchResults.js";
import FeedbackModal from "./HomeSections/FeedbackModal.js";
import WhatsappPlugin from "./WhatsappPlugin.js";
import FbPlugin from "./FbPlugin.js";
import Trending from "./HomeSections/Trending.js";
import ReferModal from "./HomeSections/ReferModal.js";
import TopHeader from "./HomeSections/TopHeader.js";
import Refer from "./HomeSections/Refer.js";
import LeadershipBoard from "./HomeSections/LeadershipBoard.js";

// Import Swiper styles

// install Swiper components
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
var isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var isBlink = isChrome && !!window.CSS;

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      cwidth: "",
      cheight: "",
      zoomValue: "",
      userCanvasList: [],
      userCanvas: {},
      category: "",
      allCanvas: {},
      searchActive: false,
      searchResultsArray: [],
      term: "",
      currentPage: 1,
      pageSize: 20,
      count: -1,
      showterm: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      file: "",
      showFeedbackModal: false,
      feedback: "",
      fSubject: "",
      message: "",
      showRefer: false,
      copied: false,
      referLink: "",
      fName: "",
      lName: "",
      rEmail: "",
      path: this.props.match.path,
      showLeader: false,
      leaders: [],
      referrals: [],
    };
  }

  componentDidMount() {
    if (this.props.match.path === "/refer") {
      this.setState({ showRefer: true });
    }

    if (this.props.match.path === "/leaders") {
      this.setState({ showLeader: true });
    }
    sessionStorage.removeItem(`size`);
    sessionStorage.removeItem(`canvasName`);
    for (var a in sessionStorage) {
      if (a[0] + a[1] == "J-") {
        sessionStorage.removeItem(a);
      }
    }
    this.props.getLeaders();
    this.props.getUser();
  }

  handleInputChange = (event) => {
    const target = event.target;
    let value = target.value;
    /*switch (target.type) {
      case "checkbox": {
        value = target.checked;
        break;
      }
    }*/
    this.setState({ [event.target.name]: value });
  };

  static getDerivedStateFromProps(props, state) {
    props.exportEmptyData();
    let returnState = {};
    if (
      props.userInfo !== undefined &&
      props.userInfo !== state.userInfo &&
      props.userInfoDate !== state.userInfoDate
    ) {
      returnState.userInfo = props.userInfo ? props.userInfo.data : {};
      returnState.email = props.userInfo ? props.userInfo.data.email : "";
      returnState.name = props.userInfo ? props.userInfo.data.name : "";
      returnState.profilePicture = props.userInfo
        ? props.userInfo.data.profile_picture_url
        : "";
      returnState.referLink = props.userInfo
        ? props.userInfo.data.refer_link
        : "";

      if (props.updated !== undefined && props.updated == true) {
        returnState.showProfileModal = false;
        returnState.update = false;
        returnState.file = "";
        returnState.password = "";
        returnState.confirmPassword = "";
      }
    }

    if (
      props.allCanvas !== undefined &&
      state.searchResultsArray &&
      state.searchResultsArray.length == 0 &&
      props.allCanvas.success == true
    ) {
      //returnState.searchActive = props.allCanvas.data ? true : false;
      returnState.allCanvas = props.allCanvas ? props.allCanvas.data : {};
      returnState.searchResultsArray = props.allCanvas.data
        ? props.allCanvas.data.result
        : [];
      returnState.count = props.allCanvas.data
        ? props.allCanvas.data.meta.count
        : 0;

      returnState.currentPage = props.allCanvas.data
        ? props.allCanvas.data.meta.currentPage
        : 0;

      returnState.pageSize = props.allCanvas.data
        ? props.allCanvas.data.meta.pageSize
        : 0;
    }

    if (
      props.allCanvas !== undefined &&
      props.allCanvas !== state.allCanvas &&
      state.searchResultsArray.length !== 0 &&
      props.allCanvasDate !== state.allCanvasDate
    ) {
      returnState.allCanvasDate = props.allCanvasDate;
      returnState.searchResultsArray = [
        ...state.searchResultsArray,
        ...props.allCanvas.data.result,
      ];
      returnState.count = props.allCanvas.data
        ? props.allCanvas.data.meta.count
        : 0;

      returnState.currentPage = props.allCanvas.data
        ? props.allCanvas.data.meta.currentPage
        : 0;
    }
    if (
      props.feedbackSubmit !== undefined &&
      props.feedbackSubmit !== state.feedbackSubmit &&
      props.feedbackSubmitDate !== state.feedbackSubmitDate
    ) {
      returnState.feedbackSubmitDate = props.feedbackSubmitDate;
      returnState.message = props.feedbackSubmit
        ? props.feedbackSubmit.message
        : "";
      returnState.fSubject = "";
      returnState.feedback = "";
    }

    if (
      props.errorData !== undefined &&
      props.errorData !== state.errorData &&
      props.errorData.status !== "success"
    ) {
      returnState.message = props.errorData
        ? props.errorData.message
        : "Internal server error";
    }

    if (
      props.inviteUsers !== undefined &&
      props.inviteUsers !== state.inviteUsers &&
      props.inviteUsersDate !== state.inviteUsersDate
    ) {
      returnState.inviteUsersDate = props.inviteUsersDate;
      returnState.inviteUsers = props.inviteUsers;
    }

    if (
      props.leaders !== undefined &&
      props.leaders !== state.leaders &&
      props.leadersDate !== state.leadersDate
    ) {
      returnState.leadersDate = props.leadersDate;
      returnState.leaders = props.leaders ? props.leaders.data : [];
      returnState.referrals = props.leaders ? props.leaders.referrals : [];
    }
    return returnState;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  customSize = () => {
    let random = Math.random().toString(36).substring(7);
    let error = false;
    let cg = "cus";
    let id = v4();
    this.setState({
      widthErrorClass: "",
      heightErrorClass: "",
      formError: false,
    });

    if (
      typeof this.state.cheight == undefined ||
      this.state.cheight == null ||
      this.state.cheight < 100 ||
      this.state.cheight > 8000
    ) {
      this.setState({
        errorMessage: "",
        heightErrorClass: "fieldErrorHome",
        showModal: true,
      });
      error = true;
    }

    if (
      typeof this.state.cwidth == undefined ||
      this.state.cwidth == null ||
      this.state.cwidth < 100 ||
      this.state.cwidth > 8000
    ) {
      this.setState({
        errorMessage: "",
        widthErrorClass: "fieldErrorHome",
        showModal: true,
      });
      error = true;
    }

    if (error === true) {
      return;
    }
    let scale = this.state.cwidth / this.state.cheight;

    let formData = {
      width: this.state.cwidth,
      height: this.state.cheight,
      zoomValue: scale / 3,
    };
    this.props.setCanvasSize(formData);
    let canvasSize = {
      width: this.state.cwidth,
      height: this.state.cheight,
      zoomValue: scale / 3,
    };

    sessionStorage.setItem("size", JSON.stringify(canvasSize));
    // localStorage.removeItem("J");
    if (!isFirefox) {
      {/*setTimeout(() => {
        this.setState({ showModal: false, cwidth: "", cheight: "" });
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = `/design/${id}/edit/${cg}&cat=${random}`;
        a.click();
        //this.props.history.push("/");
      }, 0);*/}

      let url = `/design/${id}/edit/${cg}&cat=${random}`;
      let newTab = window.open();
      newTab.location.href = url;

      //  setTimeout(() => {
      //   let url = `/design/${id}/edit/${cg}&cat=${random}`;
      //   // window.open(url, "_blank");
      //   window.open(url, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");

      // }, 0);
    }
    if (isFirefox) {
      setTimeout(() => {
        let url = `/design/${id}/edit/${cg}&cat=${random}`;
        window.open(url, "_blank");
      }, 0);
    }
  };

  showCustomModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      widthErrorClass: "",
      heightErrorClass: "",
    });
  };

  setOthers = () => {
    this.setState({
      showModal: false,
      widthErrorClass: "",
      heightErrorClass: "",
      cheight: "",
      cwidth: "",
    });
  };

  handleSubmit = (event) => {
    this.props.exportEmptyData();
    event.preventDefault();
    if (this.state.term !== this.state.showterm) {
      //console.log("lol");
      this.setState({
        searchActive: true,
        searchResultsArray: [],
        currentPage: 1,
        pageSize: 20,
        showterm: this.state.term,
      });

      //this.props.exportEmptyData();
      if (this.state.term) {
        let term = this.state.term ? this.state.term.trim() : "";
        let formData = {
          term: term,
          currentPage: 1,
          pageSize: 20,
        };

        this.props.templateSearchOuter(formData);
      } else {
        this.handleSearchClose();

        //this.setState({ searchActive: false });
        /*let formData = {
        category: this.state.cg ? this.state.cg : "cus",
      };*/
        // /this.props.getTemplates(formData);
      }
      //  this.setState({ templateList: [], searchActive: true });
    }
  };

  handleScroll = (e) => {
    this.props.exportEmptyData();
    let element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // managing scroll position for pagination
      if (
        this.state.searchActive &&
        this.state.currentPage !== this.state.count &&
        this.state.count !== this.state.pageSize
      ) {
        let formData = {
          currentPage: this.state.currentPage + 1,
          pageSize: this.state.pageSize,
          term: this.state.term ? this.state.term : this.state.showterm,
        };

        this.props.templateSearchOuter(formData);
        this.setState({
          currentPage: formData.page,
        });
      }
    }
  };

  handleSearchClose = () => {
    this.props.exportEmptyData();
    this.setState({
      term: "",
      searchActive: false,
      searchResultsArray: [],
      currentPage: 1,
      pageSize: 20,
      showterm: "",
      showRefer: false,
      showLeader: false,
    });
    this.props.history.push("/home");
    //this.props.getUser();
    //this.props.getUserCanvas();
  };

  handleModalSubmit = () => {
    if (isFormSubmit()) {
      //====Frontend validation=================
      let error = false;
      let formData = {};
      let password = this.state.password;
      this.setState({
        emailError: "",
        passwordError: "",
        formError: false,
        nameError: "",
      });

      if (
        typeof this.state.name == undefined ||
        this.state.name == null ||
        this.state.name.trim() == ""
      ) {
        this.setState({
          errorMessage: "",
          nameError: "fieldError",
          //formError: true,
        });
        error = true;
      }

      if (
        typeof this.state.email == undefined ||
        this.state.email == null ||
        this.state.email == ""
      ) {
        this.setState({
          errorMessage: "",
          emailError: "fieldError",
          //formError: true,
        });
        error = true;
      }

      if (this.state.password && this.state.password.length) {
        if (
          typeof this.state.password === undefined ||
          this.state.password === null ||
          this.state.password === ""
        ) {
          this.setState({
            errorMessage: "",
            passwordError: "fieldError",
            //formError: true,
          });
          error = true;
        }

        if (
          typeof this.state.confirmPassword === undefined ||
          this.state.confirmPassword === null ||
          this.state.confirmPassword === ""
        ) {
          this.setState({
            errorMessage: "",
            confirmPasswordError: "fieldError",
            //formError: true,
          });
          error = true;
        }

        if (!validator.isEmail(this.state.email)) {
          this.setState({
            formError: true,
            emailError: "fieldError",
            errorMessage: "Email entered is invalid!",
          });
          error = true;
          return;
        }

        if (this.state.password.length < 8) {
          this.setState({
            errorMessage: "Your password must be at least 8 characters",
            passwordError: "fieldError",
            formError: true,
          });
          error = true;
          return;
        }
        if (password.search(/[a-z]/i) < 0) {
          this.setState({
            errorMessage: "Your password must contain at least one letter.",
            passwordError: "fieldError",
            formError: true,
          });
          error = true;
          return;
        }
        if (password.search(/[0-9]/) < 0) {
          this.setState({
            errorMessage: "Your password must contain at least one digit.",
            passwordError: "fieldError",
            formError: true,
          });
          error = true;
          return;
        }

        if (this.state.password !== this.state.confirmPassword) {
          this.setState({
            errorMessage: "Password not matched!",
            passwordError: "fieldError",
            confirmPasswordError: "fieldError",
            formError: true,
          });
          error = true;
        }
      }
      //======End frontend validation=========

      if (error === true) {
        return;
      }

      let form_data = new FormData();

      form_data.append(
        "profile_picture_url",
        this.state.file ? this.state.file : ""
      );
      form_data.append("email", this.state.email);
      form_data.append("password", this.state.password);
      form_data.append("name", this.state.name);
      this.props.updateMe(form_data);
    }
  };

  _handleImageChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    this.setState({ file: file });

    let reader = new FileReader();
    reader.onloadend = () => {
      var binaryData = reader.result; // Encoded Base 64 File String

      var data = reader.result.split(",")[1];
      var binaryBlob = atob(data);

      //console.log("Encoded Binary File String:", JSON.stringify(binaryBlob));

      this.setState({ profileImage: JSON.stringify(binaryBlob) });

      //var base64String = window.btoa(binaryData);
      //console.log(base64String);
      this.setState({
        imagePreviewUrl: binaryData,
        profilePicture: binaryData,
        inShow: true,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    /*if (file) {
      let form_data = new FormData();
      form_data.append("profile_image", file);

      if (this.state.userType == "user") {
        form_data.append("last_name", this.state.lastName);
      }
      if (this.state.userType == "dj") {
        form_data.append("id", this.state.djId);
        if (form_data) {
          this.setState({ showLoader: true });
          this.props.updateProfile(form_data);
        }
      }
      if (this.state.userType == "user") {
        form_data.append("user_id", this.state.userId);
        this.setState({ showLoader: true });
        this.props.updateUserProfile(form_data);
      }
    }*/
  }

  showModal = () => {
    this.setState({
      showProfileModal: true,
      passwordError: "",
      confirmPasswordError: "",
      nameError: "",
      emailError: "",
    });
  };

  dismissModal = () => {
    this.setState({ showProfileModal: false });
  };

  openFeedbackModal = () => {
    this.setState({
      showFeedbackModal: true,
      showProfileModal: false,
      fSubject: "",
      feedback: "",
      feedbackError: "",
      fSubjectError: "",
      message: "",
    });
  };

  dismissFeedbackModal = () => {
    this.setState({ showFeedbackModal: false });
  };

  dismissReferModal = () => {
    this.setState({ showRefer: false, copied: false });
  };

  handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (isFormSubmit()) {
      //====Frontend validation=================
      let error = false;
      let formData = {};
      // console.log(this.state.fSubjectError);
      this.setState({
        fSubjectError: "",
        feedbackError: "",
        formError: false,
      });

      if (
        typeof this.state.fSubject === undefined ||
        this.state.fSubject === null ||
        this.state.fSubject.trim() === ""
      ) {
        this.setState({
          errorMessage: "",
          fSubjectError: "fieldError",
          //formError: true,
        });
        error = true;
      }

      if (
        typeof this.state.feedback === undefined ||
        this.state.feedback === null ||
        this.state.feedback.trim() === ""
      ) {
        this.setState({
          errorMessage: "",
          feedbackError: "fieldError",
          //formError: true,
        });
        error = true;
      }

      //======End frontend validation=========

      if (error === true) {
        return;
      }

      this.setState({ message: "Please wait ...." });
      formData = {
        subject: this.state.fSubject,
        feedback: this.state.feedback,
        email: this.state.email,
        name: this.state.name,
      };
      this.props.shareFeedback(formData);
    }
  };

  showReferModal = () => {
    this.props.history.push("/refer");
    this.setState({ showRefer: true });
  };

  copyToClipBoard = () => {
    copy(this.state.referLink);
    this.setState({ copied: true });
  };

  showLeaderModal = () => {
    this.props.getLeaders();
    setTimeout(() => {
      this.props.history.push("/leaders");
    }, 1000);

    this.setState({ showLeader: true, showRefer: false });
  };

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />;
    } else {
      $imagePreview = <div className="previewText"></div>;
    }
    return (
      <div
        style={{ overflow: "auto", backgroundColor: "#0b0a12" }}
        onScroll={this.handleScroll}
      >
        <div className="landing-page">
          <WhatsappPlugin name={this.state.name ? this.state.name : ""} />
          <FbPlugin />

          <TopHeader
            handleInputChange={this.handleInputChange}
            showModal={this.showModal}
            handleSearchClose={this.handleSearchClose}
            showCustomModal={this.showCustomModal}
            showModalE={this.state.showModal}
            cwidth={this.state.cwidth}
            widthErrorClass={this.state.widthErrorClass}
            cheight={this.state.cheight}
            heightErrorClass={this.state.heightErrorClass}
            customSize={() => this.customSize()}
            setOthers={this.setOthers}
            userInfo={this.state.userInfo}
            openFeedbackModal={this.openFeedbackModal}
            showReferModal={this.showReferModal}
            logout={() => logout()}
            showRefer={this.state.showRefer}
            showLeaderModal={this.showLeaderModal}
            showLeader={this.state.showLeader}
          />
          {!this.state.showRefer && !this.state.showLeader && (
            <div>
              <form onSubmit={this.handleSubmit}>
                <div className="search_section" onClick={this.setOthers}>
                  <h2>What would you like to design?</h2>
                  <div className="search_templates">
                    <img src="./home-img/search.svg" alt="icon" />
                    <input
                      type="text"
                      placeholder="Search Templates"
                      value={this.state.term}
                      autoComplete="off"
                      onChange={this.handleInputChange}
                      name="term"
                    />
                    {this.state.searchActive && (
                      <div
                        className="clear_all"
                        onClick={this.handleSearchClose}
                      >
                        &#10005; Clear
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className={this.state.searchActive ? "noDisplay" : ""}>
                <div className="" onClick={this.setOthers}>
                  <NewDesign />
                </div>
                <div onClick={this.setOthers}>
                  <RecentDesign userInfo={this.state.userInfo} />
                </div>
                <div onClick={this.setOthers}>
                  <Trending userInfo={this.state.userInfo} />
                </div>
              </div>

              {this.state.searchActive && this.state.searchResultsArray && (
                <SearchResults
                  searchArray={
                    this.state.searchResultsArray.length
                      ? this.state.searchResultsArray
                      : []
                  }
                  term={this.state.showterm}
                />
              )}
            </div>
          )}
          {this.state.showRefer && (
            <Refer
              referLink={this.state.referLink}
              inviteUsers={this.state.inviteUsers}
              inviteUsersDate={this.state.inviteUsersDate}
            />
          )}
          {this.state.showLeader && !this.state.showRefer && (
            <LeadershipBoard
              leaders={this.state.leaders}
              referrals={this.state.referrals}
            />
          )}
        </div>
        <div
          className={
            this.state.showProfileModal
              ? "modal-backdrop fade show"
              : "modal fade noDisplay"
          }
          id="account_settings"
          tabIndex="-1"
          aria-labelledby="account_settings"
          aria-hidden="true"
          style={{ paddingRight: "15px", display: "block" }}
        >
          <form>
            <div className="modal-dialog modal_custom text-center modal-dialog-centered">
              <div className="modal-content">
                <div
                  className="close_button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={this.dismissModal}
                >
                  <img src="/home-img/close.svg" alt="icon" />
                </div>
                <div className="edit_profile">
                  <div className="profile_image">
                    {this.state.profilePicture && (
                      <img src={this.state.profilePicture} />
                    )}
                  </div>
                  <div className="select_file">
                    <label for="select_file">Update Picture</label>
                    <input
                      type="file"
                      name="profile_picture_url"
                      onChange={(e) => this._handleImageChange(e)}
                      id="select_file"
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </div>
                  <div className="fields">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      className={this.state.nameError ? "fieldError" : ""}
                      onChange={this.handleInputChange}
                      autoComplete="off"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      className={this.state.emailError ? "fieldError" : ""}
                      value={this.state.email}
                      onChange={this.handleInputChange}
                      required
                      autoComplete="off"
                      disabled={this.state.email ? true : false}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      name="password"
                      value={this.state.password}
                      className={this.state.passwordError ? "fieldError" : ""}
                      onChange={this.handleInputChange}
                      required
                      autoComplete="off"
                    />
                    <input
                      type="password"
                      value={this.state.confirmPassword}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      className={
                        this.state.confirmPasswordError ? "fieldError" : ""
                      }
                      autoComplete="off"
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <button
                    className="save_button"
                    onClick={this.handleModalSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {this.state.showFeedbackModal && (
          <FeedbackModal
            dismissFeedbackModal={() => this.dismissFeedbackModal()}
            handleInputChange={(e) => this.handleInputChange(e)}
            feedbackError={this.state.feedbackError}
            fSubjectError={this.state.fSubjectError}
            handleFeedbackSubmit={(e) => this.handleFeedbackSubmit(e)}
            message={this.state.message}
            fSubject={this.state.fSubject}
            feedback={this.state.feedback}
          />
        )}

        {/*this.state.showRefer && (
          <ReferModal
            dismissReferModal={() => this.dismissReferModal()}
            handleInputChange={(e) => this.handleInputChange(e)}
            feedbackError={this.state.referError}
            fSubjectError={this.state.rEmailError}
            handleFeedbackSubmit={(e) => this.handleReferSubmit(e)}
            message={this.state.message}
            copied={this.state.copied}
            referLink={this.state.referLink}
            copyToClipBoard={() => this.copyToClipBoard()}
          />
        )*/}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  const homeData = state.HomeReducer;

  if (homeData) {
    returnState.canvasSize = homeData ? homeData.data : {};
  }

  if (state.CanvasExternalReducer.action === "USER_INFO") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userInfo = state.CanvasExternalReducer.data;
      returnState.userInfoDate = new Date();
      //console.log(canvasData);
    }
  }

  if (state.CanvasExternalReducer.action === "UPDATE_USER") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.userInfo = state.CanvasExternalReducer.data;
      returnState.userInfoDate = new Date();
      returnState.updated = true;
      //console.log(canvasData);
    }
  }

  if (state.CanvasExternalReducer.action === "SEARCH_ALL_TEMPLATE") {
    if (state.CanvasExternalReducer.data.success !== true) {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.allCanvas = state.CanvasExternalReducer.data;

      returnState.allCanvasDate = new Date();
    }
  }

  if (state.CanvasExternalReducer.action === "USER_FEEDBACK") {
    if (state.CanvasExternalReducer.data.status !== "success") {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.feedbackSubmit = state.CanvasExternalReducer.data;

      returnState.feedbackSubmitDate = new Date();
    }
  }

  if (state.CanvasExternalReducer.action === "INVITE_MAILS") {
    if (state.CanvasExternalReducer.data.status !== 200) {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.inviteUsers = state.CanvasExternalReducer.data;
      returnState.inviteUsersDate = new Date();
      //console.log(canvasData);
    }
  }

  if (state.CanvasExternalReducer.action === "GET_LEADERS") {
    if (state.CanvasExternalReducer.data.status !== 200) {
      returnState.errorData = state.CanvasExternalReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.leaders = state.CanvasExternalReducer.data;
      returnState.leadersDate = new Date();
      //console.log(canvasData);
    }
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setCanvasSize: setCanvasSize,
      getUser: getUser,
      updateMe: updateMe,
      templateSearchOuter: templateSearchOuter,
      shareFeedback: shareFeedback,
      getLeaders: getLeaders,
      exportEmptyData: exportEmptyData,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
