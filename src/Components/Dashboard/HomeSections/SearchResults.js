import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { fabric } from "fabric";
import { v4 } from "uuid";
import lzwCompress from "lzwcompress";
import {
  loadTemplate,
  exportEmptyData,
} from "../../../Actions/templatesActions.js";

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

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      term: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    let returnState = {};
    let cg = "";
    let id = v4();
    if (
      props.loadedTemplate !== undefined &&
      props.loadedTemplate !== state.loadedTemplate &&
      props.loadDate !== state.loadDate
    ) {
      //console.log(props.loadedTemplate);
      returnState.loadedTemplate = props.loadedTemplate;
      returnState.templateObject = props.loadedTemplate
        ? props.loadedTemplate.template
        : "";
      returnState.loadedTemplateId = props.loadedTemplate
        ? props.loadedTemplate._id
        : "";
      returnState.templateSize = props.loadedTemplate
        ? props.loadedTemplate.template_size
        : "";
      returnState.templateCategory = props.loadedTemplate
        ? props.loadedTemplate.category
        : "cus";

      cg = returnState.templateCategory;
      //console.log(cg);
      let random = Math.random().toString(36).substring(7);
      sessionStorage.setItem(`size`, returnState.templateSize);
      lzwCompress.unpack(
        sessionStorage.setItem("J-" + id, returnState.templateObject)
      );
      if (!isFirefox) {
        setTimeout(() => {
          //props.history.push("/");
          let a = document.createElement("a");
          a.target = "_blank";

          a.href = `/design/${id}/edit/${cg}&cat=${random}`;
          a.click();
        }, 0);
      }
      if (isFirefox) {
        setTimeout(() => {
          let url = `/design/${id}/edit/${cg}&cat=${random}`;
          window.open(url, "_blank");
        }, 0);
      }
      setTimeout(() => {
        sessionStorage.removeItem("J-" + id);
      }, 3000);
    }
    return returnState;
  }

  loadTemplate = (id) => {
    let formData = {
      id: id,
    };
    this.props.loadTemplate(formData);
  };

  render() {
    //  console.log(this.props.searchArray);
    return (
      <div className="container mt-4">
        <div className="search_results pl-0 pr-0">
          <h3 className="list_heading">Search Results for {this.props.term}</h3>
          {this.props.searchArray && this.props.searchArray.length && (
            <div className="design_list search_results_list">
              {this.props.searchArray.map((obj, id) => {
                return (
                  <div
                    className="design_list_item"
                    onClick={(id) => this.loadTemplate(obj._id)}
                    key={id}
                  >
                    <div className="list_image_wrapper align-items-start">
                      <img
                        src={obj.template_image}
                        alt="search designs image"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {this.props.term && this.props.searchArray && !this.props.showLoader && (
          <div className={this.props.searchArray.length ? "noDisplay" : "mt-4"}>
            <h4 className="noDataSearch">
              Sorry, we couldn’t find any templates for "{this.props.term}"
            </h4>
          </div>
        )}

        {this.props.term && this.props.searchArray && this.props.showLoader && (
          <div className={"mt-4"}>
            <h4 className="noDataSearch">
              {"Loading templates for " + this.props.term}
            </h4>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let returnState = {};
  const data = state.CanvasReducer;
  if (data) {
    returnState.canvas = data ? data.canvasData : {};
  }

  if (state.TemplateReducer.action === "LOAD_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.loadedTemplate = state.TemplateReducer.data;
      returnState.loadDate = new Date();
    }
  }

  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadTemplate: loadTemplate,
      exportEmptyData: exportEmptyData,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchResults));
