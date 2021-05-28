import React, { Component } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";

import { isFormSubmit } from "../../Utils/services.js";
import { forgetPassword, resetPassword } from "./../../Actions/loginActions.js";
import { resetLoginState } from "./../../Actions/canvasActions.js";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errorMessage: "",
      resetSuccess: false,
      token: this.props.match.params.id ? this.props.match.params.id : true,
    };
  }

  componentDidMount() {
    if (!this.state.token || this.state.token.length < 10) {
      this.props.history.push("/login");
    }
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    if (
      props.resetStatus !== undefined &&
      props.resetStatus !== state.resetStatus
    ) {
      returnState.resetSuccess = true;
    }

    if (
      props.errorData !== undefined &&
      props.errorData.status == "error" &&
      props.errorData !== state.errorData &&
      props.errorDate !== state.errorDate
    ) {
      returnState.errorMessage = props.errorData.message
        ? props.errorData.message
        : "";
      returnState.formError = true;
      returnState.errorDate = props.errorDate;
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

  handleSubmit = (event) => {
    event.preventDefault();
    if (isFormSubmit()) {
      //====Frontend validation=================
      let error = false;
      let formData = {};
      let password = this.state.password;
      this.setState({
        confirmPasswordError: "",
        passwordError: "",
        formError: false,
        errorMessage: "",
      });

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

      if (this.state.password !== this.state.confirmPassword) {
        this.setState({
          errorMessage: "Password not matched!",
          passwordError: "fieldError",
          confirmPasswordError: "fieldError",
          formError: true,
        });
        error = true;
      }

      if (error === true) {
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
        confirm_password: this.state.confirmPassword,
        password: this.state.password,
        token: this.state.token,
      };

      this.props.resetPassword(formData);
    }
  };

  redirectToLogin = () => {
    this.props.resetLoginState(true);
    this.props.history.push("/login");
  };

  render() {
    return (
      <section className="App-section">
        {/*<!--------------NAVIGATION HTML----------------->*/}
        <div className="container">
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
            <a className="navbar-brand" onClick={this.redirectToLogin}>
              <img src="/img/logo.png" />
            </a>

            {
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo03"
              >
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                  <li className="nav-item active">
                    <a className="nav-link" onClick={this.redirectToLogin}>
                      Home <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  {/*<li className="nav-item">
                  <a className="nav-link">Templates</a>
                </li>*/}
                </ul>
                {/*<form className="form-inline my-2 my-lg-0">
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
            }
          </nav>
        </div>

        {/*<!------------------------------->*/}

        <div className="container">
          <div className="login-box">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="log-sign_inner">
                  <div className="login-form">
                    {/* <!-----------------RESET NEW PASSWORD------------------>*/}

                    {this.state.token && this.state.token.length > 10 && (
                      <div
                        className={this.state.resetSuccess ? "noDisplay" : ""}
                      >
                        <h1>Reset your password</h1>
                        <p></p>
                        {this.state.formError && (
                          <div className="mt-3">
                            <p class="errorMsg">{this.state.errorMessage}</p>
                          </div>
                        )}
                        <form onSubmit={this.handleSubmit}>
                          <span
                            className={
                              this.state.passwordError
                                ? "input_user f-name fieldError"
                                : "input_user f-name"
                            }
                          >
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input
                              type="password"
                              name="password"
                              class="input-text"
                              placeholder="Enter a new password"
                              value={this.state.password}
                              onChange={this.handleInputChange}
                              autoComplete="off"
                            />
                          </span>
                          <span
                            className={
                              this.state.confirmPasswordError
                                ? "input_user f-name mt-3 fieldError"
                                : "input_user f-name mt-3"
                            }
                          >
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input
                              type="password"
                              name="confirmPassword"
                              class="input-text"
                              placeholder="Confirm new password"
                              value={this.state.confirmPassword}
                              onChange={this.handleInputChange}
                              autoComplete="off"
                            />
                          </span>
                          <div class="log-butns mt-3">
                            <button class="login_btn" type="submit">
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/*<!-------------------------->*/}

                    {/*!-----------------PASSWORD RESET Successful------------------>*/}

                    {this.state.resetSuccess && (
                      <div>
                        <h1>Password reset successful</h1>
                        <p>You can now use your new password to login</p>

                        <div class="log-butns mt-3">
                          <button
                            onClick={this.redirectToLogin}
                            class="login_btn"
                          >
                            Login
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
                  <img src="/img/login-img.png" alt="" />
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

  if (state.LoginReducer.action === "RESET_PASSWORD") {
    if (state.LoginReducer.data.status !== "success") {
      returnState.errorData = state.LoginReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.resetStatus = state.LoginReducer.data;
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      resetPassword: resetPassword,
      resetLoginState: resetLoginState,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResetPassword));
