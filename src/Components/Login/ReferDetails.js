import React, { Component } from "react";
import { withRouter } from "react-router";
import validator from "validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import WhatsappPlugin from "../Dashboard/WhatsappPlugin.js";
import FbPlugin from "../Dashboard/FbPlugin.js";
import { contactUs, getLeadersOuter } from "./../../Actions/loginActions.js";

class ReferDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      message: "",
      msg: "",
      leaders: [],
    };
  }

  redirectToHome = () => {
    this.props.history.push("/login");
  };

  componentDidMount() {
    this.props.getLeadersOuter();
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};

    if (
      props.contactData !== undefined &&
      props.contactData !== state.contactData &&
      props.contactDate !== state.contactDate
    ) {
      if (props.contactData.code === 200) {
        returnState.msg = props.contactData.message;
        returnState.email = "";
        returnState.name = "";
        returnState.message = "";
      }
    }

    if (
      props.leaders !== undefined &&
      props.leaders !== state.leaders &&
      props.leadersDate !== state.leadersDate
    ) {
      returnState.leadersDate = props.leadersDate;
      returnState.leaders = props.leaders ? props.leaders.data : [];
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

  handleSubmit = (e) => {
    e.preventDefault();

    let error = false;
    let formData = {};
    this.setState({
      emailError: "",
      nameError: "",
      messageError: "",
    });

    if (
      typeof this.state.email === undefined ||
      this.state.email === null ||
      this.state.email === ""
    ) {
      this.setState({
        errorMessage: "",
        emailError: "fieldError",
        //formError: true,
      });
      error = true;
    }
    if (
      typeof this.state.name === undefined ||
      this.state.name === null ||
      this.state.name === ""
    ) {
      this.setState({
        errorMessage: "",
        nameError: "fieldError",
        //formError: true,
      });
      error = true;
    }

    if (
      typeof this.state.message === undefined ||
      this.state.message === null ||
      this.state.message === ""
    ) {
      this.setState({
        errorMessage: "",
        messageError: "fieldError",
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

    if (error === true) {
      return;
    }

    //======End frontend validation=========

    formData = {
      email: this.state.email,
      name: this.state.name,
      message: this.state.message,
    };
    this.setState({ msg: "Sending request... " });
    this.props.contactUs(formData);
  };

  render() {
    return (
      <div>
        <div class="iphone-banner">
          <div className="header-refer">
            <div className="container">
              <WhatsappPlugin name={"Guest"} />
              <FbPlugin />
              <nav className="navbar navbar-expand-lg navbar-light">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarTogglerDemo03"
                  aria-controls="navbarTogglerDemo03"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" onClick={this.redirectToHome}>
                  <img src="/img/logo.png" alt="logo" />
                </a>
                <div
                  className="collapse navbar-collapse"
                  id="navbarTogglerDemo03"
                >
                  {/*<ul className="navbar-nav mt-2 mt-lg-0">
                    <li className="nav-item">
                      <a
                        className="nav-link refer"
                        onClick={this.redirectToHome}
                      >
                        Home <span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link refer">
                        Refer and Earn{" "}
                        <span className="sr-only">(current)</span>
                      </a>
                    </li>
                  </ul>*/}
                  <div
                    className="ml-auto mr-auto"
                    style={{ cursor: "pointer" }}
                  >
                    <a
                      href="https://apps.apple.com/us/app/poster-flyer-maker-icon-design/id1241339881"
                      target="_blank"
                    >
                      <img src="/img/apple-icon.svg"></img>
                    </a>
                  </div>
                  {/* <form className="form-inline my-2 my-lg-0">
                    <button
                      type="button"
                      className="btn btn-light btn-login"
                      onClick={this.showLoginModal}
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-signup"
                      onClick={this.showSignupModal}
                    >
                      Sign up
                    </button>
                  </form>*/}
                </div>
              </nav>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="inner-banner-container">
                  <div class="row">
                    <div class="col-md-6 col-12">
                      <div class="iphone-img">
                        <img src="/home-img/iphone.png" class="img-fluid" />
                      </div>
                    </div>
                    <div class="col-md-6 col-12">
                      <div class="iphone-text">
                        <span class="refer">refer to friends</span>
                        <span class="win">&amp; get a chance to </span>
                        <span class="iphone">
                          <span class="ip-color">win an iphone</span> &amp;
                          MORE...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="how-works">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h1 class="refer-heading">How it works</h1>
              </div>
              <div class="col-12">
                <div class="row">
                  <div class="col-md-3 text-center">
                    <span class="how-img">
                      <img src="/home-img/login.png" class="img-fluid" />
                    </span>
                    <span class="how-text">1. Login to your account</span>
                  </div>
                  <div class="col-md-3 text-center">
                    <span class="how-img">
                      <img src="/home-img/refer.png" class="img-fluid" />
                    </span>
                    <span class="how-text">2. go to refer and earn</span>
                  </div>
                  <div class="col-md-3 text-center">
                    <span class="how-img">
                      <img src="/home-img/friend.png" class="img-fluid" />
                    </span>
                    <span class="how-text">3. refer to a friend</span>
                  </div>
                  <div class="col-md-3 text-center">
                    <span class="how-img">
                      <img src="/home-img/win.png" class="img-fluid" />
                    </span>
                    <span class="how-text">4. Win Prizes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container features">
          <div class="row">
            <div class="col-12">
              <h1 class="refer-heading mb-4">features</h1>
              <h5 class="text-center mt-0 pb-4 mb-4">
                Create stunning designs with the help of each Poster App Lab
                feature
              </h5>
            </div>
            <div class="col-md-7 features-text">
              <h4></h4>
              <ul>
                <li>
                  <span>
                    Give your message impact, no matter what you have to say.
                    With Poster App you can add text to photos easily and
                    quickly.
                  </span>
                </li>
                <li>
                  <span>Crop your photos the simple way! Crop it.</span>
                </li>
                <li>
                  <span>
                    Add amazing photo filters to make your photos magnificent.
                  </span>
                </li>
                <li>
                  <span>
                    Flip & Rotate a picture in a second to make a quick and
                    efficient print edit, balance your design or bring symmetry.
                  </span>
                </li>
                <li>
                  <span>
                    Add stickers to your photos for free - now with thousands of
                    choices.
                  </span>
                </li>
              </ul>
            </div>
            <div class="col-md-5 col-12">
              <div class="video-section">
                <video
                  width="500"
                  height="320"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  controls
                >
                  <source
                    src={
                      "https://" +
                      +window.location.hostname +
                      "/api/videos/2.mp4"
                    }
                    type="video/mp4"
                  />
                  <source
                    src={
                      "https://" +
                      window.location.hostname +
                      "/api/videos/3.mov"
                    }
                    type="video/ogg"
                  />
                  Your browser does not support the video tag.
                </video>
                {/*<ReactPlayer url={"http://localhost:3008/videos/1.mov"} />*/}
                {/*<img src="/home-img/feature-video.png" class="img-fluid" />*/}
              </div>
            </div>
          </div>
        </div>

        {/*<div class="features-list">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h1 class="refer-heading">Features List</h1>
              </div>
              <div class="col-md-12 features-list-text">
                <h5>
                  Quisque aliquet mattis facilisis. Aenean gravida ex eu libero
                  hendrerit tristique. Nam ac tortor et lacus congue tincidunt.
                  Phasellus consequat quam massa, imperdiet pellentesque r.isus
                  tincidunt eget. Phasellus porta libero ut tempus suscipit.
                  Proin et ante sit amet purus venenatis condimentum.{" "}
                </h5>
                <ul>
                  <li>
                    <span>
                      Nulla non lectus id justo gravida mollis. Nullam nec neque
                      commodo, efficitur lacus sed, laoreet purus. Nam vel
                      venenatis.
                    </span>
                  </li>
                  <li>
                    <span>
                      Quisque eget ex vitae urna imperdiet pretium nec ac eros.
                      Curabitur posuere nibh eget augue viverra tempor.
                    </span>
                  </li>
                  <li>
                    <span>
                      Vivamus auctor erat tincidunt sem lacinia faucibus. Fusce
                      egestas.
                    </span>
                  </li>
                  <li>
                    <span>
                      Proin vitae eleifend neque. Etiam placerat nisi sapien, in
                      dignissim risus accumsan ac.
                    </span>
                  </li>
                  <li>
                    <span>
                      Fusce in condimentum turpis. Proin egestas ipsum arcu,
                      facilisis.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>*/}
        <div class="container team-member-container">
          <div class="row">
            <div class="col-12">
              <div class="team-members">
                <div class="col-12">
                  <h1 class="refer-heading mb-1" style={{ color: "#000" }}>
                    Leadership Board
                  </h1>
                  <p class="text-center mt-0 pt-0">
                    Check Who Are The Top Inviters
                  </p>
                </div>
                {/*this.state.leaders &&
                    this.state.leaders.length > 0 &&
                    this.state.leaders.map((obj, id) => {
                      return (
                        <div class="referral-inner-box">
                          <div class="d-flex">
                            <div class="star">
                              <span class="winner">{id + 1}</span>
                            </div>
                            <div class="winner-img">
                              <img
                                src={
                                  obj.profile_picture_url
                                    ? obj.profile_picture_url
                                    : "./home-img/placeholder.svg"
                                }
                                class="img-fluid"
                              />
                            </div>
                            <div class="winner-designation">
                              <span class="w-name">{obj.name}</span>
                              <span class="w-desg">Head Manager</span>
                            </div>
                            <div class="per-bar">
                              <span class="per-color w-100"></span>
                              <span class="per-number">
                                {obj.referral_count ? obj.referral_count : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })*/}
                <div class="referral-box-container">
                  <h1>Top Inviters</h1>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">Name</th>
                          {/*<th scope="col">Invited</th>
                            <th scope="col">Pending</th>*/}
                          <th scope="col">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.leaders &&
                          this.state.leaders.length > 0 &&
                          this.state.leaders.map((obj, id) => {
                            if (id === 5 || id >= 5) return;
                            return (
                              <tr>
                                <td>
                                  <div class="d-flex">
                                    <div class="star">
                                      <span class="winner">{id + 1}</span>
                                    </div>

                                    <div class="winner-img">
                                      <img
                                        src={
                                          obj.profile_picture_url
                                            ? obj.profile_picture_url
                                            : "./home-img/placeholder.svg"
                                        }
                                        class="img-fluid"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>{obj.name}</td>
                                {/*<td>{obj.invites}</td>
                                  <td>{obj.pending ? obj.pending : 0}</td>*/}
                                <td>
                                  {obj.referral_count ? obj.referral_count : 0}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class=" footer-referral">
          <div class="container">
            <div class="row">
              <div class="col-md-5 col-12 mr-auto send-message">
                <div class="row">
                  <div class="col-12">
                    <h1 class="refer-heading">Contact Us</h1>
                  </div>
                  <div class="col-12 separate-text">
                    Need some help with Poster App? Or maybe you just have a
                    question or want to tell us how much you love Poster App!?
                    write a message to get in touch with us.
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-12 send-message-form">
                {this.state.msg && (
                  <p style={{ color: "#ffffff" }}>{this.state.msg}</p>
                )}
                <form>
                  <div class="form-group">
                    <input
                      type="text"
                      class={
                        this.state.nameError
                          ? "form-control fieldError"
                          : "form-control"
                      }
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="email"
                      class={
                        this.state.emailError
                          ? "form-control fieldError"
                          : "form-control"
                      }
                      placeholder="Email Address"
                      value={this.state.email}
                      onChange={this.handleInputChange}
                      name="email"
                    />
                  </div>
                  <div class="form-group">
                    <textarea
                      class={
                        this.state.messageError
                          ? "form-control fieldError"
                          : "form-control"
                      }
                      placeholder="Message"
                      name="message"
                      value={this.state.message}
                      onChange={this.handleInputChange}
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <button
                      type="submit"
                      class="btn btn-refer-form float-right"
                      onClick={this.handleSubmit}
                    >
                      submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-copyright">
          <div class="container">
            <div class="row">
              <div class="col-12 text-center">
                Copyright © 2020 <span>POSTERMAKER</span> | ALL RIGHTS RESERVED
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const returnState = {};

  if (state.LoginReducer.action === "CONTACT_US") {
    if (state.LoginReducer.data.status !== "success") {
      returnState.errorData = state.LoginReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.contactData = state.LoginReducer.data;
      returnState.contactDate = new Date();
    }
  }

  if (state.LoginReducer.action === "GET_LEADERS_OUTER") {
    if (state.LoginReducer.data.status !== 200) {
      returnState.errorData = state.LoginReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.leaders = state.LoginReducer.data;
      returnState.leadersDate = new Date();
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      contactUs: contactUs,
      getLeadersOuter: getLeadersOuter,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferDetails));
