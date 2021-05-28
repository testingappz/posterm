import React, { Component } from "react";
import validator from "validator";

export default class FeedbackModal extends Component {
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
                  onClick={() => this.props.dismissFeedbackModal()}
                >
                  <img src="/home-img/close.svg" alt="icon" />
                </div>
                <div className="edit_profile">
                  <div class="modal-heading">Share Feedback</div>
                  <p></p>
                  <p style={{ color: "#ffffff" }}>{this.props.message}</p>
                  <div className="fields">
                    <input
                      type="text"
                      placeholder="Subject"
                      name="fSubject"
                      maxLength={100}
                      value={this.props.fSubject}
                      className={this.props.fSubjectError ? "fieldError" : ""}
                      onChange={(e) => this.props.handleInputChange(e)}
                      autoComplete="off"
                      required
                    />
                    <textarea
                      type="text"
                      placeholder="Your feedback is important to us..."
                      name="feedback"
                      className={this.props.feedbackError ? "fieldError" : ""}
                      value={this.props.feedback}
                      onChange={(e) => this.props.handleInputChange(e)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <button
                    className="save_button"
                    onClick={(e) => this.props.handleFeedbackSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
