import React, { Component } from "react";

export default class BottomZoom extends Component {
  handleChange = () => {
    let canvas = this.props.canvas;
    let zoomArr = [0.5, 0.75, 0.85, 0.9, 1, 1.2, 1.5, 1.59, 2.45];
    var element = document.querySelector(".right-section-color");
    let value = element.canvas.width / element.offsetWidth;
    let indexofArr = 4;
    let val = document.querySelector("#sel").value;
    val = Number(val);
    console.log("handle change selected value ", val);
    indexofArr = zoomArr.indexOf(val);
    console.log("Handle changes", indexofArr);
    element.style["transform"] = `scale(${val})`;
  };

  render() {
    return (
      <div class="bottom-help">
        <div class="help-box">
          <div class="d-inline percentage-box">
            <ul class="help-btn">
              <li>
                <div class="zoom-header">
                  <select id="sel" class="select" onChange={this.handleChange}>
                    <option value="0.5">50%</option>
                    <option value="0.75">75%</option>
                    <option value="0.85">85%</option>
                    <option value="0.9">90%</option>
                    <option value="1 selected">100%</option>
                    <option value="1.2">120%</option>
                    <option value="1.5">150%</option>
                    <option value="1.59">Fit</option>
                    <option value="2.45">Fill</option>
                  </select>
                </div>
              </li>
              <li>
                <span class="d-inline resize-box">
                  <img src="img/resize.png" />{" "}
                  <img src="img/resize-revert.png" />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
