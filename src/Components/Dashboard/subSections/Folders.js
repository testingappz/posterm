import React, { Component } from "react";

export default class Folders extends Component {
  render() {
    return (
      <div className="folders-category mt-4">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <span className="poster-heading">Folders</span>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-sm-12 mt-2">
            <ul className="category-section">
              <li>
                <span className="icons">
                  <i className="fa fa-download" aria-hidden="true"></i>
                </span>
                <span className="text">Purchased</span>
              </li>
              <li>
                <span className="icons">
                  <i className="fa fa-heart-o" aria-hidden="true"></i>
                </span>
                <span className="text">Likes</span>
              </li>
              <li>
                <span className="icons">
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </span>
                <span className="text">Create folders</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
