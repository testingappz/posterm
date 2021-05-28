const TemplateReducer = (state = { data: "", status: "" }, action) => {
  switch (action.type) {
    case "SAVE_TEMPLATES": {
      return {
        ...state,
        data: action.payload,
        action: "SAVE_TEMPLATES",
      };
    }

    case "GET_TEMPLATES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_TEMPLATES",
      };
    }
    case "LOAD_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "LOAD_TEMPLATE",
      };
    }

    case "UPLOAD_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "UPLOAD_TEMPLATE",
      };
    }

    case "DELETE_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "DELETE_TEMPLATE",
      };
    }

    case "UPLOAD_FONT_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "UPLOAD_FONT_TEMPLATE",
      };
    }

    case "GET_FONT_TEMPLATES": {
      return {
        ...state,
        data: action.payload,
        action: "GET_FONT_TEMPLATES",
      };
    }

    case "LOAD_FONT_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "LOAD_FONT_TEMPLATE",
      };
    }

    case "SEARCH_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_TEMPLATE",
      };
    }

    case "SEARCH_FC_TEMPLATE": {
      return {
        ...state,
        data: action.payload,
        action: "SEARCH_FC_TEMPLATE",
      };
    }

    case "GET_TRENDS": {
      return {
        ...state,
        data: action.payload,
        action: "GET_TRENDS",
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

export default TemplateReducer;
