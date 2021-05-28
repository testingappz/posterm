import axios from "axios";
import config from "./../config";
import { setToken, setConfigData } from "./../Utils/services.js";
let url = config.API_URL;
const signUpInstance = axios.create();
signUpInstance.interceptors.response.use(
  function (response) {
    if (response.headers.access_token) {
      setToken(response.headers.access_token);
    }

    return response;
  },

  function (error) {
    if (error.response.data.status === 602) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export function signUp() {
  return (dispatch) => {
    dispatch({ type: "SIGN_UP" });
  };
}

export function signUpBasic(signUpData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "user-signup", signUpData)
      .then((response) => {
        dispatch({ type: "SIGN_UP_BASIC", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "SIGN_UP_BASIC", payload: error.response.data });
        }
      });
  };
}

export function userLogin(userData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "user-login", userData)
      .then((response) => {
        dispatch({ type: "LOGIN_SUCCESSFULL", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "LOGIN_ERROR", payload: error.response.data });
        }
      });
  };
}

export function socialLogin(userData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "social-login", userData)
      .then((response) => {
        dispatch({ type: "SOCIAL_LOGIN_SUCCESSFULL", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "SOCIAL_LOGIN_ERROR",
            payload: error.response.data,
          });
        }
      });
  };
}

export function forgetPassword(formData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "forget-password", formData)
      .then((response) => {
        dispatch({ type: "FORGET_PASSWORD", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "FORGET_PASSWORD", payload: error.response.data });
        }
      });
  };
}

export function resetPassword(formData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "reset-password", formData)
      .then((response) => {
        dispatch({ type: "RESET_PASSWORD", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "RESET_PASSWORD", payload: error.response.data });
        }
      });
  };
}

export function contactUs(formData) {
  return (dispatch) => {
    signUpInstance
      .post(url + "contact-us", formData)
      .then((response) => {
        dispatch({ type: "CONTACT_US", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({ type: "CONTACT_US", payload: error.response.data });
        }
      });
  };
}

export function getLeadersOuter() {
  return (dispatch) => {
    signUpInstance
      .get(url + "refer/get-leaders")
      .then((response) => {
        dispatch({ type: "GET_LEADERS_OUTER", payload: response.data });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: "GET_LEADERS_OUTER",
            payload: error.response.data,
          });
        }
      });
  };
}
