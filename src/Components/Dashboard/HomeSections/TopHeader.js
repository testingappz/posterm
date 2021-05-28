import React, { Component } from "react";

export default class TopHeader extends Component {
  render() {
    return (
      <div>
        <div className="top_section">
          <div className="dropdown d-flex align-items-center show">
            <div class="home_icon mr-5" onClick={this.props.handleSearchClose}>
              <a>
                <img
                  src="./home-img/home_ic.svg"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </a>
            </div>
            {!this.props.showRefer && !this.props.showLeader && (
              <button
                className="create_new_dimensions"
                type="button"
                onClick={this.props.showCustomModal}
              >
                <img src="./home-img/custom.svg" alt="icon" />  Custom
                Dimensions
              </button>
            )}
            {this.props.showModalE && (
              <div
                className="dropdown-menu dropdown_custom dropdown_custom_left show"
                style={{ marginLeft: "60px" }}
              >
                <div className="create_new_dimensions_dropdown">
                  <input
                    type="text"
                    placeholder="width in px"
                    value={this.props.cwidth}
                    onChange={this.props.handleInputChange}
                    name={"cwidth"}
                    autoComplete="off"
                    className={
                      this.props.widthErrorClass ? "fieldErrorHome" : ""
                    }
                  />
                  <span className="ratio_lock">
                    <img src="./home-img/unlocked.svg" alt="icon" />
                    {/*<!-- <img src="images/locked.svg" alt="icon" /> -->*/}
                  </span>
                  <input
                    type="text"
                    placeholder="height in px"
                    value={this.props.cheight}
                    name={"cheight"}
                    onChange={this.props.handleInputChange}
                    autoComplete="off"
                    className={
                      this.props.heightErrorClass ? "fieldErrorHome" : ""
                    }
                  />
                  <button
                    type="button"
                    className="create_button"
                    onClick={() => this.props.customSize()}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="dropdown" onClick={this.props.setOthers}>
            {this.props.userInfo && (
              <div
                className="profile_dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="profile_avatar">
                  <img
                    src={
                      this.props.userInfo &&
                      this.props.userInfo.profile_picture_url
                        ? this.props.userInfo.profile_picture_url
                        : "./home-img/placeholder.svg"
                    }
                    alt="avatar"
                  />
                </div>
                <div className="profile_desc">
                  <h4>{this.props.userInfo.name}</h4>
                  <h6>
                    {this.props.userInfo.email == "xxx@xxx.com"
                      ? ""
                      : this.props.userInfo.email}
                  </h6>
                  <img src={"./home-img/dropdown.svg"} alt="icon" />
                </div>
              </div>
            )}
            <div className="dropdown-menu dropdown-menu-right dropdown_custom dropdown_custom_right">
              {/*<a className="drop_item" href="javascript:;">
                Action 1
              </a>
              <a className="drop_item" href="javascript:;">
                Action 2
              </a>*/}

              <a className="drop_item" onClick={this.props.showModal}>
                Account Settings
              </a>
              <a class="drop_item" onClick={this.props.openFeedbackModal}>
                Feedback
              </a>
              <a className="drop_item" onClick={this.props.showReferModal}>
                Refer & Earn
              </a>
              <a className="drop_item" onClick={this.props.showLeaderModal}>
                Leadership Board
              </a>
              <a className="drop_item" onClick={() => this.props.logout()}>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
