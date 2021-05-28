import React, { Component } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { isFormSubmit, allClearBeforeLogin } from "../../Utils/services.js";
import {
  userLogin,
  signUpBasic,
  socialLogin,
  forgetPassword,
} from "./../../Actions/loginActions.js";
import { resetLoginState } from "./../../Actions/canvasActions.js";
import WhatsappPlugin from "../Dashboard/WhatsappPlugin.js";
import FbPlugin from "../Dashboard/FbPlugin.js";

class Login extends Component {
  constructor(props) {
    super(props);
    const sessionEmail = localStorage.getItem("sessionEmail");
    const session = localStorage.getItem("session");
    this.state = {
      showSignup: false,
      showLogin: false,
      showButtons: true,
      name: "",
      email: "",
      emailR: sessionEmail ? sessionEmail : "",
      password: "",
      errorMessage: "",
      formError: false,
      displayForget: false,
      showResetPass: false,
      forgetPasswordData: {},
      resetSuccess: false,
      resetState: false,
      remember_check: session ? session : false,
      showPolicy: false,
      userChange: false,
      id: this.props.match.params.uid,
    };
  }

  componentDidMount() {
    this.setState({ errorMessage: "", formError: false });
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    if (props.userData !== undefined && props.userData !== state.userData) {
      localStorage.setItem(
        "access-token",
        JSON.stringify(props.userData.token)
      );
      if (state.remember_check == true) {
        localStorage.setItem("sessionEmail", props.userData.email);
        localStorage.setItem("session", state.remember_check);
      }
      returnState.errorMessage = "";
      returnState.passwordError = "";
      returnState.emailError = "";
      returnState.formError = false;
      allClearBeforeLogin(); // clear the session storage of template
      props.history.push("/home");
    }
    if (
      props.errorData !== undefined &&
      props.errorData.status == "error" &&
      props.errorData !== state.errorData &&
      props.errorDate !== state.errorDate &&
      state.userChange == false
    ) {
      returnState.errorMessage = props.errorData.message
        ? props.errorData.message
        : "";

      returnState.formError = true;
      returnState.errorDate = props.errorDate;
    }

    if (
      props.forgetPasswordData !== undefined &&
      props.forgetPasswordData.code == 200 &&
      props.forgetPasswordData !== state.forgetPasswordData &&
      props.forgetDate !== state.forgetDate
    ) {
      returnState.forgetDate = props.forgetDate;
      returnState.showResetPass = true;
      returnState.displayForget = false;
      returnState.formError = false;
      returnState.emailError = "";
      returnState.passwordError = "";
    }
    if (
      props.resetState !== undefined &&
      props.resetState !== state.resetState
    ) {
      returnState.resetState = props.resetState;
      returnState.formError = false;
    }

    return returnState;
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    if (event.target.name == "name" && value !== "") {
      this.setState({ nameError: "" });
    }

    this.setState({
      [event.target.name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (isFormSubmit()) {
      //====Frontend validation=================
      let error = false;
      let formData = {};
      this.setState({
        emailError: "",
        passwordError: "",
        formError: false,
        resetState: false,
      });

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

      if (error === true) {
        return;
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
      //======End frontend validation=========

      formData = {
        email: this.state.email,
        password: this.state.password,
      };
      if (this.state.remember_check == true) {
        localStorage.setItem("sessionEmail", this.state.email);
        localStorage.setItem("session", this.state.remember_check);
      }
      if (this.state.remember_check == false) {
        localStorage.removeItem("sessionEmail");
        localStorage.removeItem("session");
      }
      this.setState({ userChange: false });
      this.props.userLogin(formData);
    }
  };

  handleSubmitSignup = (event) => {
    event.preventDefault();

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

      if (error === true) {
        return;
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

      //======End frontend validation=========

      formData = {
        email: this.state.email,
        password: this.state.password,
        name: this.state.name,
        refer: this.state.id ? this.state.id : "",
      };
      this.setState({ userChange: false });
      this.props.signUpBasic(formData);
    }
  };

  responseGoogle = (response) => {
    let formData = {};
    if (response && response.profileObj && response.profileObj.email) {
      formData = {
        googleId: response.googleId ? response.googleId : "",
        name: response.profileObj ? response.profileObj.name : "",
        email: response.profileObj ? response.profileObj.email : "",

        token: response.accessToken ? response.accessToken : "",
        google_token: response.accessToken ? response.accessToken : "",
        profile_picture_url: response.profileObj
          ? response.profileObj.imageUrl
          : "",
        refer: this.state.id ? this.state.id : "",
      };

      this.setState({ userChange: false });
      this.props.socialLogin(formData);
    } else {
      console.error("Google error, please try again later!");
    }
  };

  handleFBLogin = (response) => {
    let formData = {};
    if (response) {
      formData = {
        fbId: response.userID ? response.userID : "",
        name: response.name ? response.name : "",
        email: response.email ? response.email : "",
        token: response.accessToken ? response.accessToken : "",
        profile_picture_url: response.picture ? response.picture.data.url : "",
        refer: this.state.id ? this.state.id : "",
      };
      this.setState({ userChange: false });
      this.props.socialLogin(formData);
    } else {
      console.error("Facebook error, please try again later!");
    }
  };

  showLoginModal = () => {
    this.setState({
      showLogin: true,
      showButtons: false,
      showSignup: false,
      name: "",
      email: this.state.emailR,
      password: "",
      formError: false,
      displayForget: false,
      emailError: "",
      passwordError: "",
      showResetPass: false,
      showPolicy: false,
    });

    if (!this.state.emailR) {
      this.setState({
        showLogin: true,
        showButtons: false,
        showSignup: false,
        name: "",
        email: "",
        password: "",
        formError: false,
        displayForget: false,
        emailError: "",
        passwordError: "",
        showResetPass: false,
        showPolicy: false,
      });
    }
  };

  showSignupModal = () => {
    this.setState({
      showSignup: true,
      showButtons: false,
      showLogin: false,
      name: "",
      email: this.state.emailR ? "" : this.state.emailR,
      password: "",
      formError: false,
      displayForget: false,
      resetState: false,
      emailError: "",
      passwordError: "",
      showPolicy: false,
    });
    this.props.resetLoginState(false);
  };

  showButtonsModal = () => {
    this.setState({
      showSignup: false,
      showButtons: true,
      showLogin: false,
      name: "",
      email: "",
      password: "",
      formError: false,
      displayForget: false,
      showResetPass: false,
      showPolicy: false,
    });
    this.props.resetLoginState(false);
  };

  showForgetPassword = () => {
    this.setState({
      errorMessage: "",
      displayForget: !this.state.displayForget,
      showSignup: false,
      showButtons: false,
      showLogin: false,
      name: "",
      email: "",
      password: "",
      formError: false,
      showPolicy: false,
      emailError: "",
      passwordError: "",
      errorMessage: "",
      userChange: true,
    });
    this.props.resetLoginState(false);
  };

  handleforgetPassword = (event) => {
    event.preventDefault();

    if (isFormSubmit()) {
      //====Frontend validation=================
      let error = false;

      this.setState({ emailError: "", passwordError: "", formError: false });

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
      let formData = {
        email: this.state.email,
      };
      this.setState({ userChange: false });
      this.props.forgetPassword(formData);
    }
  };

  showHome = () => {
    this.setState({
      showLogin: false,
      showButtons: true,
      showSignup: false,
      name: "",
      email: this.state.emailR,
      password: "",
      formError: false,
      displayForget: false,
      emailError: "",
      passwordError: "",
      showResetPass: false,
      showPolicy: false,
    });
  };

  render() {
    //console.log(this.state.errorMessage);
    return (
      <section className="App-section">
        {/*<!--------------NAVIGATION HTML----------------->*/}
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
            <a className="navbar-brand" onClick={this.showButtonsModal}>
              <img src="/img/logo.png" alt="logo" />
            </a>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
              <ul className="navbar-nav mt-2 mt-lg-0">
                <li className="nav-item">
                  <a className="nav-link home" onClick={this.showButtonsModal}>
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
              </ul>
              <div className="ml-auto mr-auto" style={{ cursor: "pointer" }}>
                <a
                  href="https://apps.apple.com/us/app/poster-flyer-maker-icon-design/id1241339881"
                  target="_blank"
                >
                  <img src="/img/apple-icon.svg"></img>
                </a>
              </div>
              <form className="form-inline my-2 my-lg-0">
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
              </form>
            </div>
          </nav>
        </div>
        {/*<!------------------------------->*/}
        <div className={!this.state.showPolicy ? "container" : "noDisplay"}>
          <div className="login-box">
            <div className="row">
              {/*<!-----------------SIGN UP WITH GOOGLE-facebbok--------------------->*/}

              <div className="col-md-6 col-sm-12">
                <div className="log-sign_inner">
                  <div className="login-form">
                    {this.state.displayForget && (
                      <div>
                        <h1>Forgot your password</h1>
                        <p>
                          Enter your email below to receive your password reset
                          instruction
                        </p>
                      </div>
                    )}
                    {!this.state.displayForget && (
                      <div
                        className={this.state.showResetPass ? "noDisplay" : ""}
                      >
                        <h1> Design Anything Publish anywhere</h1>
                        <p>
                          Create an account, it’s free. Logo is loved by
                          beginners and expects, terms and individuals
                        </p>
                      </div>
                    )}

                    {this.state.formError && (
                      <div className="mt-3">
                        <p class="errorMsg">{this.state.errorMessage}</p>
                      </div>
                    )}

                    {this.state.showButtons && !this.state.resetState && (
                      <div>
                        <span className="d-block login-btn gg-btn mb-3">
                          <a className="btn-google mt-3 ">
                            <GoogleLogin
                              clientId={
                                "839691531671-1imn2b7dgas59sgvksis1c0sp4l9o3oo.apps.googleusercontent.com"
                              }
                              autoLoad={false}
                              onSuccess={this.responseGoogle}
                              className="google-btn w-100 btn"
                              buttonText="Login with Google"
                            ></GoogleLogin>
                            {/*<img src="img/google-btn.png" alt="" />*/}
                          </a>
                        </span>
                        <span className="d-block login-btn fb-btn">
                          {
                            <FacebookLogin
                              appId="1229316637538231"
                              autoLoad={false}
                              fields="name,email,picture"
                              callback={this.handleFBLogin}
                              cssClass="my-facebook-button-className btn btn-fb"
                              icon="fa-facebook"
                            />
                          }
                          {/*<img src="img/facebook-btn.png" alt="" />*/}
                        </span>
                        <span
                          className="d-block sign-up-email mt-3"
                          onClick={this.showSignupModal}
                        >
                          Sign up with Email
                        </span>
                        <span className="d-block mt-2  already-txt">
                          Already have account?
                          <a
                            className="already-signup"
                            onClick={this.showLoginModal}
                          >
                            Login
                          </a>
                        </span>
                      </div>
                    )}

                    {/*<!----------------->*/}

                    {/*<!-----------------SIGN UP WITH EMAIL------------------->*/}
                    {this.state.showSignup && (
                      <div className={this.state.showPolicy ? "noDisplay" : ""}>
                        <form onSubmit={this.handleSubmitSignup}>
                          <span
                            className={
                              this.state.nameError
                                ? "input_user fieldError"
                                : "input_user"
                            }
                          >
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <input
                              type="text"
                              name="name"
                              className="input-text"
                              placeholder="Your Name"
                              value={this.state.name}
                              onChange={this.handleInputChange}
                              autoComplete={"off"}
                            />
                          </span>
                          <span
                            className={
                              this.state.emailError
                                ? "input_user  mt-3 fieldError"
                                : "input_user  mt-3"
                            }
                          >
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                            <input
                              type="text"
                              name="email"
                              className="input-text"
                              placeholder="Your email"
                              value={this.state.email}
                              onChange={this.handleInputChange}
                              autoComplete={"off"}
                            />
                          </span>
                          <span
                            className={
                              this.state.passwordError
                                ? "input_user mt-3 fieldError"
                                : "input_user mt-3"
                            }
                          >
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input
                              type="password"
                              name="password"
                              className="input-text"
                              placeholder="Your password"
                              value={this.state.password}
                              onChange={this.handleInputChange}
                              autoComplete={"off"}
                            />
                          </span>
                          <span className="agree d-block mt-3">
                            By signing up you agree to Poster Web's{" "}
                            <a
                              className="termCondition"
                              href="/term-conditions"
                              target="_blank"
                            >
                              Terms of Use
                            </a>{" "}
                            and{" "}
                            <a
                              className="termCondition"
                              href="/privacy-policy"
                              target="_blank"
                            >
                              Privacy Policy
                            </a>
                          </span>
                          <div className="mt-4">
                            <button className="login_btn" type="submit">
                              Sign up
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/*<!-----------------LOGIN WITH EMAIL------------------->*/}
                    {(this.state.showLogin || this.state.resetState) && (
                      <div className={this.state.showPolicy ? "noDisplay" : ""}>
                        <form onSubmit={this.handleSubmit}>
                          <span
                            className={
                              this.state.emailError
                                ? "input_user f-name fieldError"
                                : "input_user f-name"
                            }
                          >
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                            <input
                              type="text"
                              name="email"
                              className="input-text"
                              placeholder="Your email"
                              value={this.state.email}
                              onChange={this.handleInputChange}
                              autoComplete={"off"}
                            />
                          </span>
                          <span
                            className={
                              this.state.passwordError
                                ? "input_user password-block fieldError mt-3 "
                                : "input_user password-block mt-3"
                            }
                          >
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input
                              type="password"
                              name="password"
                              className="input-pass"
                              placeholder="Your password"
                              value={this.state.password}
                              onChange={this.handleInputChange}
                              autoComplete={"off"}
                            />
                          </span>
                          <span className="input_user forgot_user mt-2">
                            <input
                              type="checkbox"
                              name="remember_check"
                              onChange={this.handleInputChange}
                              checked={
                                this.state.remember_check ? "checked" : false
                              }
                            />
                            <label htmlFor="Log_checkbox">Remember Me</label>
                            <a
                              className="forgetP"
                              onClick={this.showForgetPassword}
                            >
                              Forgot password?
                            </a>
                          </span>
                          <div className="log-butns mt-3">
                            <button className="login_btn" type="submit">
                              Login
                            </button>
                          </div>
                        </form>
                        <div class="log-butns mt-2">
                          <button onClick={this.showHome} className="login_btn">
                            <i
                              className="fa fa-caret-left"
                              aria-hidden="true"
                            ></i>
                            Back
                          </button>
                        </div>
                      </div>
                    )}

                    {/*<!----------------->*/}

                    {/*<!-----------------Forgot Passowrd------------------>*/}

                    {this.state.displayForget && (
                      <div>
                        <form onSubmit={this.handleforgetPassword}>
                          <span
                            className={
                              this.state.emailError
                                ? "input_user  mt-3 fieldError"
                                : "input_user  mt-3"
                            }
                          >
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                            <input
                              type="text"
                              name="email"
                              class="input-text"
                              placeholder="Your email"
                              value={this.state.email}
                              onChange={this.handleInputChange}
                            />
                          </span>
                          <div class="log-butns mt-3">
                            <button type="submit" className="login_btn">
                              Submit
                            </button>
                          </div>
                          <div class="log-butns mt-2">
                            <button
                              onClick={this.showLoginModal}
                              className="login_btn"
                            >
                              <i
                                className="fa fa-caret-left"
                                aria-hidden="true"
                              ></i>
                              Back
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {/* <!-------------------------->*/}

                    {/*<!-----------------You are nearly there------------------>*/}

                    {this.state.showResetPass && (
                      <div>
                        <h1>You are nearly there!</h1>
                        <p>
                          Please check your email. We've sent a link to reset
                          your password
                        </p>

                        {/* <div class="log-butns mt-3">
                          <button class="login_btn">Done</button>
                        </div>*/}
                        <div class="log-butns mt-2">
                          <button
                            onClick={this.showLoginModal}
                            className="login_btn"
                          >
                            <i
                              className="fa fa-caret-left"
                              aria-hidden="true"
                            ></i>
                            Back
                          </button>
                        </div>
                      </div>
                    )}

                    {/*<!-------------------------->*/}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="Log-sign_image">
                  <img src="/img/login-img.png" alt="login-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
const mapStateToProps = (state) => {
  const returnState = {};
  if (state.CanvasReducer !== undefined) {
    const data = state.CanvasReducer;
    returnState.resetState = data ? data.reset : false;
    // console.log(data);
  }

  if (state.LoginReducer.action === "LOGIN") {
    if (state.LoginReducer.Logindata.status !== "success") {
      returnState.errorData = state.LoginReducer.Logindata;
      returnState.errorDate = new Date();
    } else {
      const userData = state.LoginReducer.Logindata.data;
      returnState.userData = state.LoginReducer.Logindata.data;
      localStorage.setItem("useMe", JSON.stringify(userData));
      localStorage.setItem("youLoggedIn", 1);
    }
  }
  if (state.LoginReducer.action === "SIGN_UP_BASIC") {
    if (state.LoginReducer.data.status !== "success") {
      returnState.errorData = state.LoginReducer.data;
      returnState.errorDate = new Date();
    } else {
      const userData = state.LoginReducer.data.data;
      returnState.userData = state.LoginReducer.data.data;
      localStorage.setItem("useMe", JSON.stringify(userData));
      localStorage.setItem("youLoggedIn", 1);
    }
  }
  if (state.LoginReducer.action === "SOCIAL_LOGIN") {
    if (state.LoginReducer.Socialdata.status !== "success") {
      returnState.errorData = state.LoginReducer.Socialdata;
      returnState.errorDate = new Date();
    } else {
      const userData = state.LoginReducer.Socialdata.data;
      returnState.userData = state.LoginReducer.Socialdata.data;
      localStorage.setItem("useMe", JSON.stringify(userData));
      localStorage.setItem("youLoggedIn", 1);
    }
  }

  if (state.LoginReducer.action === "FORGET_PASSWORD") {
    if (state.LoginReducer.data.status !== "success") {
      returnState.errorData = state.LoginReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.forgetPasswordData = state.LoginReducer.data;
      returnState.forgetDate = new Date();
    }
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      userLogin: userLogin,
      signUpBasic: signUpBasic,
      socialLogin: socialLogin,
      forgetPassword: forgetPassword,
      resetLoginState: resetLoginState,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
