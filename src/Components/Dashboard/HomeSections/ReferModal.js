import React, { Component } from "react";
import validator from "validator";

export default class ReferModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div
          className={"modal-backdrop fade show"}
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
                  onClick={() => this.props.dismissReferModal()}
                >
                  <img src="/home-img/close.svg" alt="icon" />
                </div>
                <div className="edit_profile">
                  {<div class="modal-heading mb-2">Refer & Earn</div>}
                  <p style={{ color: "#ffffff" }}>
                    Refer to friends and win Iphone
                  </p>
                  <p style={{ color: "#ffffff" }}>{this.props.message}</p>
                  <div className="fields">
                    <input
                      type="text"
                      placeholder="First name"
                      name="fName"
                      value={this.props.first_name}
                      className={this.props.firstNameError ? "fieldError" : ""}
                      onChange={this.props.handleInputChange}
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      name="lName"
                      className={this.props.lastNameError ? "fieldError" : ""}
                      value={this.props.last_name}
                      onChange={this.props.handleInputChange}
                      required
                      autoComplete="off"
                      disabled={this.props.email ? true : false}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      name="rEmail"
                      value={this.props.rEmail}
                      className={this.props.rEmailError ? "fieldError" : ""}
                      onChange={this.props.handleInputChange}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <button
                    className="save_button"
                    onClick={(e) => this.props.handleReferSubmit(e)}
                  >
                    Share
                  </button>
                  <hr />
                  <div className="fields">
                    <h5
                      className="copyShare mb-3 "
                      style={{ color: "#ffffff" }}
                    >
                      {" "}
                      Copy & Share Link
                    </h5>

                    <input
                      type="text"
                      placeholder=""
                      name="referLink"
                      value={this.props.referLink}
                      autoComplete="off"
                      required
                      disabled
                    />
                    <br />
                    {!this.props.copied && (
                      <a
                        className="ml-2"
                        style={{ color: "#ffffff" }}
                        onClick={() => this.props.copyToClipBoard()}
                      >
                        Copy
                      </a>
                    )}

                    {this.props.copied && (
                      <a className="ml-2" style={{ color: "#ffffff" }}>
                        Copied
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
