import axios from "axios";
import { getToken, handleInvalidToken } from "../Utils/services.js";
import config from "./../config";

let url = config.API_URL;
let unsplashKey = "9ItoTOsAgNSyvvOeiWvf6krcO4hPYORmvM9hDPhbt-w";
let giphyKey = "9uXOsHo2kJhZdADKOLD59smlB19747Of";

const sidebarInstance = axios.create();

sidebarInstance.interceptors.response.use(
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

export function getBackImages(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "photos/back-images", formData)
      .then((response) => {
        dispatch({ type: "GET_BACK_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "GET_BACK_IMAGES", payload: error.response.data });
        }
      });
  };
}

export function getBackground(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "photos/background-images", formData)
      .then((response) => {
        dispatch({ type: "GET_BACKGROUND_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_BACKGROUND_IMAGES",
            payload: error.response.data,
          });
        }
      });
  };
}
export function getSvgs() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .get(url + "photos/svg-images")
      .then((response) => {
        dispatch({ type: "GET_SVG_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_SVG_IMAGES",
            payload: error.response.data,
          });
        }
      });
  };
}

export function uploadUserImage(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "uploads/upload-img", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "UPLOAD_USER_IMAGE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "UPLOAD_USER_IMAGE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getUserUploadImage() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken;
  return (dispatch) => {
    sidebarInstance
      .post(url + "uploads/user-uploads")
      .then((response) => {
        dispatch({ type: "GET_USER_UPLOAD_IMAGE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_USER_UPLOAD_IMAGE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function deleteUserImageUploads(id) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();.

  return (dispatch) => {
    sidebarInstance
      .delete(url + `uploads/delete-uploads/${id}`)
      .then((response) => {
        dispatch({ type: "DELETE_USER_UPLOAD_IMAGE", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "DELETE_USER_UPLOAD_IMAGE",
            payload: error.response.data,
          });
        }
      });
  };
}

export function photosSearch(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "search/p-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_PHOTOS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_PHOTOS",
            payload: error.response.data,
          });
        }
      });
  };
}

export function backgroundSearch(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "search/b-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_BACKGROUND", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_BACKGROUND",
            payload: error.response.data,
          });
        }
      });
  };
}

export function elementSearch(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "search/e-search", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "SEARCH_ELEMENTS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_ELEMENTS",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getUnsplashImages(formData) {
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.unsplash.com/photos?client_id=${unsplashKey}&w=1500&page=${formData.page}&per_page=20&order_by=popular`
      )
      .then((response) => {
        dispatch({ type: "GET_UNSPLASH_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_UNSPLASH_IMAGES",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getGiphy(formData) {
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.giphy.com/v1/stickers/trending?api_key=${giphyKey}&limit=400&offset=${formData.page}`
      )
      .then((response) => {
        dispatch({ type: "GET_GIPHY_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_GIPHY_IMAGES",
            payload: error.response.data,
          });
        }
      });
  };
}

export function unsplashPhotosSearch(formData) {
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.unsplash.com/search/photos?client_id=${unsplashKey}&w=1500&page=${formData.page}&per_page=50&query=${formData.query}`
      )
      .then((response) => {
        dispatch({ type: "SEARCH_UNSPLASH_PHOTOS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_UNSPLASH_PHOTOS",
            payload: error.response.data,
          });
        }
      });
  };
}

export function giphySearch(formData) {
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.giphy.com/v1/stickers/search?api_key=${giphyKey}&q=${formData.term}&limit=50&offset=${formData.page}&rating=G&lang=en`
      )
      .then((response) => {
        dispatch({ type: "SEARCH_GIPHY_IMAGES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_GIPHY_IMAGES",
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

export function unsplashBackgroundSearch(formData) {
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.unsplash.com/search/photos?client_id=${unsplashKey}&w=1500&page=${formData.page}&per_page=30&query=${formData.query}`
      )
      .then((response) => {
        dispatch({
          type: "SEARCH_UNSPLASH_BACKGROUND",
          payload: response.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SEARCH_UNSPLASH_BACKGROUND",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getShapes() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .get(url + "photos/shapes-in")
      .then((response) => {
        dispatch({ type: "GET_SHAPES", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_SHAPES",
            payload: error.response.data,
          });
        }
      });
  };
}

export function uploadUserVideo(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "uploads/upload-v", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "UPLOAD_USER_VIDEO", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "UPLOAD_USER_VIDEO",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getUserVideos() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken;
  return (dispatch) => {
    sidebarInstance
      .post(url + "uploads/user-v")
      .then((response) => {
        dispatch({ type: "GET_USER_UPLOAD_VIDEOS", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_USER_UPLOAD_VIDEOS",
            payload: error.response.data,
          });
        }
      });
  };
}

export function deleteUserVideoUploads(id) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();.

  return (dispatch) => {
    sidebarInstance
      .delete(url + `uploads/delete-v/${id}`)
      .then((response) => {
        dispatch({ type: "DELETE_USER_UPLOAD_VIDEO", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "DELETE_USER_UPLOAD_VIDEO",
            payload: error.response.data,
          });
        }
      });
  };
}

export function videoConveter(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "uploads/v-convert", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "VIDEO_CONVERT", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "VIDEO_CONVERT",
            payload: error.response.data,
          });
        }
      });
  };
}

export function pexelsVideoList(formData) {
  sidebarInstance.defaults.headers.common["Authorization"] =
    "563492ad6f91700001000001d9a2a812225f4e7ca208104183a644aa";
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.pexels.com/videos/popular?per_page=${formData.per_page}&page=${formData.page}&min-duration=${formData.minDuration}&max-duration=${formData.maxDuration}`
      )
      .then((response) => {
        dispatch({
          type: "VIDEO_LIST",
          payload: response.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "VIDEO_LIST",
            payload: error.response.data,
          });
        }
      });
  };
}

export function pexelsVideoSearch(formData) {
  sidebarInstance.defaults.headers.common["Authorization"] =
    "563492ad6f91700001000001d9a2a812225f4e7ca208104183a644aa";
  return (dispatch) => {
    sidebarInstance
      .get(
        `https://api.pexels.com/videos/search?query=${formData.query}&per_page=${formData.per_page}&page=${formData.page}&min-duration=${formData.minDuration}&max-duration=${formData.maxDuration}`
      )
      .then((response) => {
        dispatch({
          type: "VIDEO_SEARCH",
          payload: response.data,
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "VIDEO_SEARCH",
            payload: error.response.data,
          });
        }
      });
  };
}

export function pexelVideo(formData) {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .post(url + "video/videos", formData ? formData : {})
      .then((response) => {
        dispatch({ type: "PEXEL_VIDEO", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "PEXEL_VIDEO",
            payload: error.response.data,
          });
        }
      });
  };
}

export function getMask() {
  let accessToken = JSON.parse(localStorage.getItem("access-token"));
  sidebarInstance.defaults.headers.common["Authorization"] =
    "Bearer " + accessToken; //getToken();
  return (dispatch) => {
    sidebarInstance
      .get(url + "photos/mask-in")
      .then((response) => {
        dispatch({ type: "GET_MASK", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_MASK",
            payload: error.response.data,
          });
        }
      });
  };
}
