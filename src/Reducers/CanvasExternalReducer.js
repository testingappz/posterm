const canvasExternalReducer = (state = { data: "", status: "" }, action) => {
  switch (action.type) {
    case "SAVE_CANVAS": {
      return {
        ...state,
        data: action.payload,
        action: "SAVE_CANVAS",
      };
    }

    case "LOAD_CANVAS": {
      return {
        ...state,
        data: action.payload,
        action: "LOAD_CANVAS",
      };
    }

    case "GET_ALL_CANVAS": {
      return {
        ...state,
        data: action.payload,
        action: "GET_ALL_CANVAS",
      };
    }

    case "UPLOAD_CANVAS_IMAGE": {
      return {
        ...state,
        data: action.payload,
        action: "UPLOAD_CANVAS_IMAGE",
      };
    }

    case "DELETE_USER_CANVAS": {
      return {
        ...state,
        data: action.payload,
        action: "DELETE_USER_CANVAS",
      };
    }

    case "SEARCH_ALL_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_ALL_TEMPLATE",
      };
    }

    case "USER_INFO": {
      return {
        ...state,
        data: action.payload,
        action: "USER_INFO",
      };
    }

    case "SHARE_CANVAS_DESIGN": {
      return {
        ...state,
        data: action.payload,
        action: "SHARE_CANVAS_DESIGN",
      };
    }

    case "UPDATE_USER": {
      return {
        ...state,
        data: action.payload,
        action: "UPDATE_USER",
      };
    }

    case "USER_FEEDBACK": {
      return {
        ...state,
        data: action.payload,
        action: "USER_FEEDBACK",
      };
    }

    case "SOCIAL_COUNT": {
      return {
        ...state,
        data: action.payload,
        action: "SOCIAL_COUNT",
      };
    }

    case "INVITE_MAILS": {
      return {
        ...state,
        data: action.payload,
        action: "INVITE_MAILS",
      };
    }

    case "GET_LEADERS": {
      return {
        ...state,
        data: action.payload,
        action: "GET_LEADERS",
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

export default canvasExternalReducer;
