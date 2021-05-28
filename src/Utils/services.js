import axios from "axios";
import config from "../config";
import moment from "moment";
import validator from "validator";

let url = config.API_URL;

export function youLoggedIn() {
  return localStorage.getItem("youLoggedIn");
}

export function getUser() {
  return localStorage.getItem("useMe");
}

export function setToken(access_token) {
  localStorage.setItem("access-token", JSON.stringify(access_token));
  //console.log(access_token);
  axios.defaults.headers.common["Authorization"] = getToken();
}

export function getToken() {
  let token = localStorage.getItem("access-token");
  //console.log(token);
  return "Bearer " + JSON.parse(token);
}

export function logout(cid) {
  for (var a in sessionStorage) {
    if (a[0] + a[1] == "J-") {
      sessionStorage.removeItem(a);
    }
  }
  const logoutInstance = axios.create();
  logoutInstance.defaults.headers.common["Authorization"] = getToken();
  logoutInstance
    .get(url + "logout")
    .then((response) => {
      clearToken();
      console.log(cid);
      clearUserData(cid);

      window.location.href = "/login";
    })
    .catch((error) => {
      clearToken();
      clearUserData(cid);
      window.location.href = "/login";
    });
}

export function clearToken() {
  localStorage.removeItem("access-token");
  return;
}
export function handleInvalidToken() {
  clearToken();
  clearUserData();
  window.location.href = "/login";
}
export function clearUserData(cid) {
  if (cid) {
    //console.log(cid);
    localStorage.removeItem("J-" + cid);
  }
  localStorage.removeItem("access-token");
  localStorage.removeItem("useMe");
  localStorage.removeItem("youLoggedIn");
  sessionStorage.removeItem("LTID");
  localStorage.removeItem("size");
  localStorage.removeItem("canvasId");
  localStorage.removeItem("videoId");
  sessionStorage.removeItem("size");
  sessionStorage.removeItem(`canvasName`);

  return;
}

export function allClearBeforeLogin() {
  for (var a in localStorage) {
    if (a[0] + a[1] == "J-") {
      sessionStorage.removeItem(a);
    }
  }
  sessionStorage.removeItem("size");
  localStorage.removeItem("canvasId");
  localStorage.removeItem("videoId");
  sessionStorage.removeItem("LTID");
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function setTimeFormat(timeFormat) {
  switch (timeFormat) {
    case "h:i a":
      timeFormat = "hh:mm A";
      break;
    case "H:i":
      timeFormat = "HH:mm";
      break;
    default:
      timeFormat = "hh:mm A";
      break;
  }
  localStorage.setItem("timeFormat", timeFormat);
  return true;
}

export function formatTime(time) {
  let timeFormat = getTimeFormat();
  return moment(time, "HH:mm:ss").format(timeFormat);
}

export function getTimeFormat() {
  let timeFormat = localStorage.getItem("timeFormat");
  if (timeFormat) {
    return timeFormat;
  } else return "hh:mm A";
}

export function setDateFormat(dateFormat) {
  switch (dateFormat) {
    case "Y/m/d":
      dateFormat = "YYYY/MM/DD";
      break;
    case "d/m/Y":
      dateFormat = "DD/MM/YYYY";
      break;
    case "m/d/Y":
      dateFormat = "MM/DD/YYYY";
      break;
    default:
      dateFormat = "YYYY/MM/DD";
      break;
  }
  localStorage.setItem("dateFormat", dateFormat);
  return true;
}

export function getDateFormat() {
  let dateFormat = localStorage.getItem("dateFormat");
  if (dateFormat) {
    return dateFormat;
  } else return "YYYY/MM/DD";
}

export function toggleBodyScroll(isScroll) {
  if (isScroll !== undefined && isScroll === true) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

export function isFormSubmit(interval) {
  interval = interval || 1;
  let isFormSubmit = true;
  let onSubmitTime = localStorage.getItem("onSubmitTime");
  if (onSubmitTime) {
    let currentTime = moment();
    if (currentTime.diff(moment.unix(onSubmitTime), "seconds") <= interval) {
      isFormSubmit = false;
    } else {
      localStorage.setItem("onSubmitTime", moment().format("X"));
    }
  } else {
    localStorage.setItem("onSubmitTime", moment().format("X"));
  }
  return isFormSubmit;
}
