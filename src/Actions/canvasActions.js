export const CHANGE_BACKGROUND = "CHANGE_BACKGROUND";
export const ADD_HEADING = "ADD_HEADING";
export const EMPTY_DATA = "EMPTY_DATA";
export const GET_CANVAS = "GET_CANVAS";
export const SIDE_BAR = "SIDE_BAR";
export const FILTERS = "FILTERS";
export const OBJECT_TYPE = "OBJECT_TYPE";
export const ADJUSTMENTS = "ADJUSTMENTS";
export const ACTIVE_INDEX = "ACTIVE_INDEX";
export const UNDO_REDO = " UNDO_REDO";
export const FILE_MENU = "FILE_MENU";
export const TOOLS_MENU = "TOOLS_MENU";
export const MAIN_SIDE_BAR = "MAIN_SIDE_BAR";
export const CROP_STATE = "CROP_STATE";
export const SCROLL_STATE = "SCROLL_STATE";
export const BGMODAL_STATE = "BGMODAL_STATE";
export const RESET_STATE = "RESET_STATE";
export const LOADER_STATE = "LOADER_STATE";
export const VOLUME_STATE = "VOLUME_STATE";
export const UPLOAD_STATE = "UPLOAD_STATE";
export const BACKGROUND_STATE = "BACKGROUND_STATE";
export const BACKGROUND_COLOR = "BACKGROUND_COLOR";

export const setBackground = (color, imgUrl) => ({
  type: CHANGE_BACKGROUND,
  color,
  imgUrl,
});

export const addHeadingData = (heading) => ({
  type: ADD_HEADING,
  heading,
});

export const getCanvas = (canvasData) => ({
  type: GET_CANVAS,
  canvasData,
});

export const sideBar2 = (showSidebar2) => ({
  type: SIDE_BAR,
  showSidebar2,
});

export const showFilters = (filters) => ({
  type: FILTERS,
  filters,
});

export const getSelectedType = (objectType) => ({
  type: OBJECT_TYPE,
  objectType,
});

export const showAdjustments = (showAdjust) => ({
  type: ADJUSTMENTS,
  showAdjust,
});

export const activeObjectIndex = (objectIndex) => ({
  type: ACTIVE_INDEX,
  objectIndex,
});

export const undoRedo = (undoState) => ({
  type: UNDO_REDO,
  undoRedo: undoState,
});

export const headerMenu = (formData) => ({
  type: FILE_MENU,
  head: formData,
});

export const toolsMenu = (formData) => ({
  type: TOOLS_MENU,
  data: formData,
});

export const mainSideBarState = (showMainSideBar) => ({
  type: MAIN_SIDE_BAR,
  showMainSideBar,
});

export const cropState = (cropState) => ({
  type: CROP_STATE,
  cropState,
});

export const scrollState = (scrollState) => ({
  type: SCROLL_STATE,
  scrollData: scrollState,
});

export const backgroundState = (modalState) => ({
  type: BGMODAL_STATE,
  bgModal: modalState,
});

export const resetLoginState = (resetState) => ({
  type: RESET_STATE,
  reset: resetState,
});

export const loader = (loaderState) => ({
  type: LOADER_STATE,
  showLoader: loaderState,
});

export const isVolume = (volumeState, userChanged) => ({
  type: VOLUME_STATE,
  volume: volumeState,
  finalState: userChanged ? userChanged : false,
});

export const closeUploads = (uploadState) => ({
  type: UPLOAD_STATE,
  isUpload: uploadState,
});

export const backgroundChange = (backgroundState) => ({
  type: BACKGROUND_STATE,
  isBackground: backgroundState,
});

export const backgroundColorChange = (backgroundColor) => ({
  type: BACKGROUND_COLOR,
  isBackgroundColor: backgroundColor,
});

export const emptyData = (color, imgUrl) => ({
  type: EMPTY_DATA,
  color: "",
  imgUrl: "",
  heading: "",
  filters: false,
  showSidebar2: false,
  objectIndex: -1,
  objectType: "",
});
