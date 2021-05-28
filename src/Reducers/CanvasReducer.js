import {
  CHANGE_BACKGROUND,
  EMPTY_DATA,
  ADD_HEADING,
  GET_CANVAS,
  SIDE_BAR,
  FILTERS,
  OBJECT_TYPE,
  ADJUSTMENTS,
  ACTIVE_INDEX,
  UNDO_REDO,
  FILE_MENU,
  TOOLS_MENU,
  MAIN_SIDE_BAR,
  CROP_STATE,
  SCROLL_STATE,
  BGMODAL_STATE,
  RESET_STATE,
  LOADER_STATE,
  VOLUME_STATE,
  UPLOAD_STATE,
  BACKGROUND_STATE,
  BACKGROUND_COLOR,
} from "../Actions/canvasActions";

const canvasTools = (
  state = {
    backgroundColor: "",

    backgroundImg: "",
    status: "",
  },
  action
) => {
  switch (action.type) {
    case GET_CANVAS:
      return {
        ...state,
        canvasData: action.canvasData,
      };

    case CHANGE_BACKGROUND:
      return {
        ...state,
        backgroundColor: action.color,
        backgroundImg: action.imgUrl,
      };

    case EMPTY_DATA:
      return {
        ...state,
        backgroundColor: action.color,
        backgroundImg: action.imgUrl,
        Heading: action.heading,
        filters: action.filters,
        showSidebar2: action.showSidebar2,
      };

    case ADD_HEADING:
      return {
        ...state,
        Heading: action.heading,
      };
    case SIDE_BAR:
      return {
        ...state,
        showSidebar2: action.showSidebar2,
      };
    case FILTERS:
      return {
        ...state,
        filters: action.filters,
      };
    case OBJECT_TYPE:
      return {
        ...state,
        objectType: action.objectType,
      };

    case ADJUSTMENTS:
      return {
        ...state,
        showAdjust: action.showAdjust,
      };
    case ACTIVE_INDEX:
      return {
        ...state,
        objectIndex: action.objectIndex,
      };

    case FILE_MENU:
      return {
        ...state,
        data: action.head,
      };

    case UNDO_REDO:
      return {
        ...state,
        undoState: action.undoRedo,
      };

    case TOOLS_MENU:
      return {
        ...state,
        toolsState: action.data,
      };

    case MAIN_SIDE_BAR:
      return {
        ...state,
        mainSidebar: action.showMainSideBar,
      };

    case CROP_STATE:
      return {
        ...state,
        cropState: action.cropState,
      };

    case SCROLL_STATE:
      return {
        ...state,
        scrollData: action.scrollData,
      };

    case BGMODAL_STATE:
      return {
        ...state,
        bgModal: action.bgModal,
      };
    case RESET_STATE:
      return {
        ...state,
        reset: action.reset,
      };

    case LOADER_STATE:
      return {
        ...state,
        showLoader: action.showLoader,
      };

    case VOLUME_STATE:
      return {
        ...state,
        volume: action.volume,
        finalState: action.finalState,
      };

    case UPLOAD_STATE:
      return {
        ...state,
        isUpload: action.isUpload,
      };
    case BACKGROUND_STATE:
      return {
        ...state,
        isBackground: action.isBackground,
      };

    case BACKGROUND_COLOR:
      return {
        ...state,
        isBackgroundColor: action.isBackgroundColor,
      };

    default:
      return state;
  }
};

export default canvasTools;
