import axios from "axios";
import { getToken, handleInvalidToken } from "../Utils/services.js";
import config from "../config";

let url = config.API_URL;

const templateInstance = axios.create();

templateInstance.interceptors.response.use(
  function (response) {
    if (
      response.data != undefined
      // response.data.global_settings != undefined
    ) {
      //setConfigData(response.data.global_settings);
    }
    // positionFooterCorrectly();
    return response;
  },
  function (error) {
    if (!error.response) {
      return { data: { data: "", message: "server_error", status: 500 } };
    } else {
      if (error.response.status == 500) {
        return { data: { data: "", message: "server_error", status: 500 } };
      }
      let msg = error.response.data.message;
      if (
        msg == "invalid_token" ||
        msg == "session_timeout" ||
        msg == "server_error" ||
        msg == "token_not_found" ||
        msg == "authorization_fail" ||
        msg == "Your account has been deactivated"
      ) {
        handleInvalidToken();
        console.log(msg);
      }
      return Promise.reject(error);
    }
  }
);

export function saveTemplate(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "temp/save-temp", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SAVE_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "SAVE_TEMPLATE", payload: error.response.data });
        }
      });
  };
}

export function loadTemplate(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "temp/load-temp", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "LOAD_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "LOAD_TEMPLATE", payload: error.response.data });
        }
      });
  };
}

export function getTemplates(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "temp/get-temp", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "GET_TEMPLATES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "GET_TEMPLATES", payload: error.response.data });
        }
      });
  };
}

export function uploadTemplate(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "temp/upload-template", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "UPLOAD_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "UPLOAD_TEMPLATE", payload: error.response.data });
        }
      });
  };
}

export function deleteTemplate(templateId) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();.

  return (dispatch) => {
    templateInstance
      .delete(url + `temp/del-temp/${templateId}`)
      .then((response) => {
        dispatch({ type: "DELETE_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "DELETE_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function uploadFcTemplate(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "font/save-fcombi", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "UPLOAD_FONT_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "UPLOAD_FONT_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getFontTemplates() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .get(url + "font/get-fcombi")
      .then((response) => {
        dispatch({ type: "GET_FONT_TEMPLATES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_FONT_TEMPLATES",
            payload: error.response.data,
          });
        }
      });
  };
}

export function loadFontTemplate(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "font/load-fcombi", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "LOAD_FONT_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "LOAD_FONT_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function templateSearch(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "search/t-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function fcSearch(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "search/fc-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_FC_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_FC_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function exportEmptyData(formData) {
  return (dispatch) => {
    dispatch({
      type: "EMPTY_DATA",
      payload: { data: "", status: 200, message: "" },
    });
  };
}

export function getTrends(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  templateInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    templateInstance
      .post(url + "temp/get-trending", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "GET_TRENDS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "GET_TRENDS", payload: error.response.data });
        }
      });
  };
}
