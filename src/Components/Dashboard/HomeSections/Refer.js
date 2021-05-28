import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import copy from "copy-to-clipboard";
import validator from "validator";
import {
  exportEmptyData,
  inviteFriends,
} from "../../../Actions/canvasExternalActions.js";
import { redo } from "../Handlers/Handlers.js";

class Refer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referLink: "",
      copied: false,
      googleEmail: "",
      googlePassword: "",
      inviteEmail: "",
      message: "",
    };
  }
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    //console.log(props);
    if (props.referLink && props.referLink !== state.referLink) {
      returnState.referLink = props.referLink;
    }
    if (
      props.inviteUsers !== undefined &&
      props.inviteUsers !== state.inviteUsers &&
      props.inviteUsersDate !== state.inviteUsersDate
    ) {
      returnState.inviteUsersDate = props.inviteUsersDate;
      //returnState.inviteEmail = "";
      returnState.message = "Invite mails sent to the given email addresses";
    }
    return returnState;
  }

  copyToClipBoard = () => {
    copy(this.state.referLink);
    this.setState({ copied: true });
  };

  handleInputChange = (event) => {
    const target = event.target;
    let value = target.value;
    /*switch (target.type) {
      case "checkbox": {
        value = target.checked;
        break;
      }
    }*/
    this.setState({ [event.target.name]: value, message: "" });
  };

  handleSubmitList = (e) => {
    let error = false;
    var res = this.state.inviteEmail.split(", ");
    console.log(res);
    if (res && res.length) {
      res.map((obj, id) => {
        if (!validator.isEmail(obj)) {
          this.setState({
            emailError: "fieldError",
          });
          error = true;
          return;
        }
      });
    }

    if (error == false) {
      this.setState({
        emailError: false,
        message: "Sending mails....",
      });
    }

    if (error == true) {
      return;
    }

    let formData = {
      mails: res,
      refer_link: this.state.referLink,
    };
    this.props.inviteFriends(formData);
  };

  googleImport = () => {};

  render() {
    return (
      <div class="container mb-5">
        <div class="referral-box-container refer-friends-box">
          <div class="row mb-3">
            <div class="col-12">
              <img src="/home-img/refer-win.png" class="img-fluid refer-img" />
            </div>
          </div>
          <h1 class="text-center">Invite your friends</h1>

          {/*<div class="invitation-box">
            <div class="row">
              <div class="col-12">
                <h3>Invite gmail contacts</h3>
              </div>
              <div class="col-12">
                <input
                  type="text"
                  class="form-control form-group"
                  placeholder="Enter Your Google Email"
                  name="googleEmail"
                  value={this.state.googleEmail}
                  onChange={this.handleInputChange}
                />
                <input
                  type="password"
                  class="form-control form-group"
                  placeholder="Enter Your Google Password"
                  name={"googlePassword"}
                  value={this.state.googlePassword}
                  onChange={this.handleInputChange}
                />
              </div>

              <div class="col-12 text-center">
                <button type="submit" class="btn invite-btn">
                  Retrieve contacts
                </button>
              </div>
            </div>
          </div>*/}

          {/*<div class="row">
            <div class="col-12 text-center or-text my-4">or</div>
          </div>*/}

          <div class="invitation-box">
            <div class="row">
              <div class="col-12">
                <h3>Invite by email addresses</h3>
                {this.state.message && (
                  <p className="" style={{ color: "red", fontSize: "12px" }}>
                    {this.state.message}
                  </p>
                )}
              </div>
              <div class="col-12">
                <textarea
                  class={
                    this.state.emailError
                      ? "form-control form-group fieldError"
                      : "form-control form-group"
                  }
                  placeholder="Type a list of invitee email addresses separated by comma."
                  value={this.state.inviteEmail}
                  onChange={this.handleInputChange}
                  name={"inviteEmail"}
                ></textarea>
              </div>
              <div class="col-12 text-center">
                <button
                  type="submit"
                  class="btn invite-btn"
                  onClick={(e) => this.handleSubmitList()}
                >
                  Send invites
                </button>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 text-center or-text my-4">or</div>
          </div>

          <div class="invitation-box">
            <div class="row">
              <div class="col-12">
                <div class="copy-link-box">
                  <div class="d-flex-">
                    <span class="or-use">or use this link with friends</span>
                    <input
                      type="text"
                      class="form-control form-group copy-link"
                      placeholder=""
                      value={this.state.referLink}
                      disabled
                    />
                    <button
                      type="submit"
                      class="btn invite-btn copy-link ml-3"
                      onClick={this.copyToClipBoard}
                    >
                      Copy link
                    </button>
                    {this.state.copied && (
                      <a className="ml-2" style={{ color: "red" }}>
                        Copied
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let returnState = {};

  return returnState;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      exportEmptyData: exportEmptyData,
      inviteFriends: inviteFriends,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Refer));
