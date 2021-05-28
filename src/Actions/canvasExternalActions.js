import axios from "axios";
import { getToken, handleInvalidToken } from "../Utils/services.js";
import config from "../config";

let url = config.API_URL;

const canvasInstance = axios.create();

canvasInstance.defaults.headers.common["Authorization"] = getToken();

canvasInstance.interceptors.response.use(
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

export function saveCanvas(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "canvas/save-canvas", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SAVE_CANVAS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "SAVE_CANVAS", payload: error.response.data });
        }
      });
  };
}

export function loadCanvas(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "canvas/load-canvas", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "LOAD_CANVAS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "LOAD_CANVAS", payload: error.response.data });
        }
      });
  };
}

export function getUserCanvas(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .get(url + "canvas/user-canvas")
      .then((response) => {
        dispatch({ type: "GET_ALL_CANVAS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "GET_ALL_CANVAS", payload: error.response.data });
        }
      });
  };
}

export function uploadCanvasImage(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "canvas/user-canvas-image", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "UPLOAD_CANVAS_IMAGE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "UPLOAD_CANVAS_IMAGE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function deleteCanvas(templateId) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .delete(url + `canvas/del-canvas/${templateId}`)
      .then((response) => {
        dispatch({ type: "DELETE_USER_CANVAS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "DELETE_USER_CANVAS",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getUser() {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .get(url + "user-info")
      .then((response) => {
        dispatch({ type: "USER_INFO", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "USER_INFO", payload: error.response.data });
        }
      });
  };
}

export function templateSearchOuter(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "search/touter-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_ALL_TEMPLATE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_ALL_TEMPLATE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function shareDesign(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "canvas/share-design", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SHARE_CANVAS_DESIGN", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SHARE_CANVAS_DESIGN",
            payload: error.response.data,
          });
        }
      });
  };
}

export function updateMe(formData) {
  return (dispatch) => {
    canvasInstance
      .post(url + "update-user", formData ? formData : "")
      .then((response) => {
        dispatch({ type: "UPDATE_USER", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "UPDATE_USER", payload: error.response.data });
        }
      });
  };
}

export function shareFeedback(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "feedback", formData ? formData : "")
      .then((response) => {
        dispatch({ type: "USER_FEEDBACK", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "USER_FEEDBACK", payload: error.response.data });
        }
      });
  };
}

export function socialShareCount(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "sscount/ss-count", formData ? formData : "")
      .then((response) => {
        dispatch({ type: "SOCIAL_COUNT", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "SOCIAL_COUNT", payload: error.response.data });
        }
      });
  };
}

export function inviteFriends(formData) {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .post(url + "refer/invite-friends", formData ? formData : "")
      .then((response) => {
        dispatch({ type: "INVITE_MAILS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "INVITE_MAILS", payload: error.response.data });
        }
      });
  };
}

export function getLeaders() {
  canvasInstance.defaults.headers.common["Authorization"] = getToken();
  return (dispatch) => {
    canvasInstance
      .get(url + "refer/get-leaders")
      .then((response) => {
        dispatch({ type: "GET_LEADERS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "GET_LEADERS", payload: error.response.data });
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
