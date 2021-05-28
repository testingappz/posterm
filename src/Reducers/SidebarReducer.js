const sidebarReducer = (state = { data: "", status: "" }, action) => {
  switch (action.type) {
    case "GET_BACK_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_BACK_IMAGES",
      };
    }

    case "GET_BACKGROUND_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_BACKGROUND_IMAGES",
      };
    }

    case "GET_SVG_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_SVG_IMAGES",
      };
    }

    case "GET_SHAPES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_SHAPES",
      };
    }

    case "UPLOAD_USER_IMAGE": {
      return {
        ...state,
        data: action.payload,
        action: "UPLOAD_USER_IMAGE",
      };
    }

    case "GET_USER_UPLOAD_IMAGE": {
      return {
        ...state,
        data: action.payload,
        action: "GET_USER_UPLOAD_IMAGE",
      };
    }

    case "DELETE_USER_UPLOAD_IMAGE": {
      return {
        ...state,
        data: action.payload,
        action: "DELETE_USER_UPLOAD_IMAGE",
      };
    }

    case "SEARCH_PHOTOS": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_PHOTOS",
      };
    }

    case "SEARCH_ELEMENTS": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_ELEMENTS",
      };
    }

    case "SEARCH_BACKGROUND": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_BACKGROUND",
      };
    }

    case "GET_UNSPLASH_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_UNSPLASH_IMAGES",
      };
    }

    case "GET_GIPHY_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_GIPHY_IMAGES",
      };
    }

    case "SEARCH_UNSPLASH_PHOTOS": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_UNSPLASH_PHOTOS",
      };
    }

    case "SEARCH_UNSPLASH_BACKGROUND": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_UNSPLASH_BACKGROUND",
      };
    }

    case "SEARCH_GIPHY_IMAGES": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_GIPHY_IMAGES",
      };
    }

    case "UPLOAD_USER_VIDEO": {
      return {
        ...state,
        data: action.payload,
        action: "UPLOAD_USER_VIDEO",
      };
    }

    case "GET_USER_UPLOAD_VIDEOS": {
      return {
        ...state,
        data: action.payload,
        action: "GET_USER_UPLOAD_VIDEOS",
      };
    }

    case "DELETE_USER_UPLOAD_VIDEO": {
      return {
        ...state,
        data: action.payload,
        action: "DELETE_USER_UPLOAD_VIDEO",
      };
    }

    case "VIDEO_CONVERT": {
      return {
        ...state,
        data: action.payload,
        action: "VIDEO_CONVERT",
      };
    }

    case "VIDEO_LIST": {
      return {
        ...state,
        data: action.payload,
        action: "VIDEO_LIST",
      };
    }

    case "VIDEO_SEARCH": {
      return {
        ...state,
        data: action.payload,
        action: "VIDEO_SEARCH",
      };
    }

    case "PEXEL_VIDEO": {
      return {
        ...state,
        data: action.payload,
        action: "PEXEL_VIDEO",
      };
    }

    case "GET_MASK": {
      return {
        ...state,
        data: action.payload,
        action: "GET_MASK",
      };
    }

    case "EMPTY_DATA": {
      return { ...state, data: action.payload, action: "EMPTY_DATA" };
    }

    default: {
      return state;
    }
  }
};

export default sidebarReducer;
