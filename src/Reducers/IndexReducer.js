import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import LoginReducer from "./LoginReducer.js";
import CanvasReducer from "./CanvasReducer.js";
import SidebarReducer from "./SidebarReducer.js";
import CanvasExternalReducer from "./CanvasExternalReducer.js";
import TemplateReducer from "./TemplateReducer.js";
import HomeReducer from "./HomeReducer.js";

export default combineReducers({
  LoginReducer,
  CanvasReducer,
  SidebarReducer,
  CanvasExternalReducer,
  TemplateReducer,
  HomeReducer,
  routing: routerReducer,
});
