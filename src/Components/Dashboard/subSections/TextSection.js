import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { fontCombination, fontCombinationOne } from "../Handlers/Handlers.js";
import {
  getFontTemplates,
  loadFontTemplate,
  fcSearch,
  exportEmptyData,
} from "../../../Actions/templatesActions.js";

import {
  getCanvas,
  toolsMenu,
  showAdjustments,
  showFilters,
  sideBar2,
  getSelectedType,
} from "../../../Actions/canvasActions.js";

class TextSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontCombiData: {},
      fontCombiList: [],
      term: "",
      canvas: "",
      loadedFontCombi: {},
      searchActive: false,
    };
  }
  componentDidMount() {
    this.props.getFontTemplates();
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    /*if (event.target.name === "term") {
      let formData = {
        term: value,
      };

      this.props.fcSearch(formData);
    }*/
    this.setState({
      [event.target.name]: value,
    });
  };

  static getDerivedStateFromProps(props, state) {
    // console.log(props);
    let returnState = {};

    if (props.canvas !== undefined && props.canvas !== "") {
      returnState.canvas = props.canvas ? props.canvas : "";
    }
    if (
      props.fontCombiData !== undefined &&
      props.fontCombiData !== state.fontCombiData
    ) {
      returnState.fontCombiList = props.fontCombiData.data
        ? props.fontCombiData.data
        : [];
    }

    if (
      props.loadedFontCombi !== undefined &&
      props.loadedFontCombi !== state.loadedFontCombi &&
      props.loadDate !== state.loadDate
    ) {
      returnState.loadDate = props.loadDate;
      returnState.loadedFontCombi = props.loadedFontCombi;
      returnState.loadedObject = props.loadedFontCombi
        ? props.loadedFontCombi.fc_template
        : "";
      returnState.loadedfcId = props.loadedFontCombi
        ? props.loadedFontCombi._id
        : "";

      sessionStorage.setItem("LTID", props.loadedFontCombi._id);
      //let data = JSON.parse(returnState.loadedObject);
      //let objects = data.objects;
      //console.log(JSON.parse(returnState.loadedObject));
      //console.log(objects);
      //fontCombination(returnState.canvas, objects);
      if (returnState.canvas) {
        // fontCombinationOne(returnState.canvas);
        returnState.canvas.loadFromJSON(
          JSON.parse(returnState.loadedObject),
          returnState.canvas.renderAll.bind(returnState.canvas)
        );
        if (returnState.canvas) {
          let firstObject = returnState.canvas.getObjects()[0];
          console.log(firstObject);
        }

        //props.getSelectedType("textbox");
        //console.log("2");
        //fontCombinationOne(returnState.canvas);
      }
    }

    return returnState;
  }

  loadOnFontCombi = (id) => {
    let formData = {
      id: id,
    };
    this.props.loadFontTemplate(formData);
  };

  handleSearchClose = () => {
    this.props.getFontTemplates();
    this.setState({
      term: "",
      searchActive: false,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.exportEmptyData();
    if (this.state.term) {
      let formData = {
        term: this.state.term,
      };

      this.props.fcSearch(formData);
    } else {
      this.props.getFontTemplates();
    }
    this.setState({ fontCombiList: [], searchActive: true });
  };

  render() {
    return (
      <div className="text-category mt-4">
        <div className="row search-box">
          <div className="col-md-12 col-sm-12">
            <form onSubmit={this.handleSubmit}>
              <div className="input-group rounded-pill p-1">
                <div className="input-group-prepend border-0">
                  <button
                    id="button-addon4"
                    type="button"
                    className="btn btn-link text-info"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
                <input
                  value={this.state.term}
                  type="text"
                  placeholder="Search Text"
                  aria-describedby="button-addon4"
                  className="form-control bg-none border-0"
                  onChange={this.handleInputChange}
                  name="term"
                  autoComplete="off"
                />

                {this.state.term && (
                  <button
                    type="button"
                    className="close search-close"
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {!this.state.searchActive && (
          <div className="row text-box mt-2">
            <div className="col-md-12 col-sm-12 my-2">
              <span className="d-block">Click text to add to page</span>
            </div>

            <div className="col-md-12 col-sm-12  my-2">
              <button
                type="button"
                className="btn heading-btn w-100"
                onClick={(text) => this.props.addHeading("Add a heading")}
              >
                <h2>Add a heading</h2>
              </button>
            </div>

            <div className="col-md-12 col-sm-12 my-2">
              <button
                type="button"
                className="btn heading-btn w-100"
                onClick={(text) => this.props.addHeading("Add a subheading")}
              >
                <h5>Add a subheading</h5>
              </button>
            </div>

            <div className="col-md-12 col-sm-12 mt-2">
              <button
                type="button"
                className="btn heading-btn w-100"
                onClick={(text) =>
                  this.props.addHeading("Add a litle bit of body text heading")
                }
              >
                <h6>Add a litle bit of body text heading</h6>
              </button>
            </div>
          </div>
        )}

        {this.state.fontCombiList && (
          <div className={!this.state.searchActive ? "row mt-5" : "row mt-2"}>
            {this.state.fontCombiData && this.state.fontCombiList.length > 0 && (
              <div className="col-md-12 col-sm-12">
                <span
                  className={
                    this.state.searchActive ? "noDisplay" : "poster-heading"
                  }
                >
                  Font Combinations
                </span>
              </div>
            )}
            <div className="col-md-12 col-sm-12 mt-2">
              <ul className="category-section">
                {this.state.fontCombiData &&
                  this.state.fontCombiList.length > 0 &&
                  this.state.fontCombiList.map((obj, id) => {
                    return (
                      <li key={id} className="mb-2">
                        <span className="img-section font-box">
                          <span class="filter-box">
                            <img
                              src={obj.fc_url}
                              onClick={(id) => {
                                this.loadOnFontCombi(obj._id);
                              }}
                            />
                          </span>
                        </span>
                      </li>
                    );
                  })}
                {this.state.fontCombiData &&
                  this.state.fontCombiList.length <= 0 &&
                  this.state.searchActive && (
                    <li className="mb-2 width-100-li">
                      <span>
                        Sorry, we couldn't find any Font Combinations for "
                        {" " + this.state.term + " "} " Try searching something
                        related.
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let returnState = {};
  //console.log(state);
  if (state.TemplateReducer.action == "GET_FONT_TEMPLATES") {
    if (state.TemplateReducer.data.status !== "200") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.fontCombiData = state.TemplateReducer.data;
    }
  }

  if (state.TemplateReducer.action === "LOAD_FONT_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "success") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.loadedFontCombi = state.TemplateReducer.data;
      returnState.loadDate = new Date();
    }
  }

  if (state.TemplateReducer.action == "SEARCH_FC_TEMPLATE") {
    if (state.TemplateReducer.data.status !== "200") {
      returnState.errorData = state.TemplateReducer.data;
      returnState.errorDate = new Date();
    } else {
      returnState.fontCombiData = state.TemplateReducer.data;
    }
  }

  if (state.CanvasReducer !== undefined) {
    returnState.canvas = state.CanvasReducer.canvasData;
    returnState.canvasDate = new Date();
  }
  return returnState;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getFontTemplates: getFontTemplates,
      loadFontTemplate: loadFontTemplate,
      fcSearch: fcSearch,
      getSelectedType: getSelectedType,
      exportEmptyData: exportEmptyData,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TextSection));
