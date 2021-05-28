const loginReducer = (state = { data: "", status: "" }, action) => {
  switch (action.type) {
    case "SIGN_UP": {
      return {};
    }

    case "SIGN_UP_BASIC": {
      return {
        ...state,
        data: action.payload,
        action: "SIGN_UP_BASIC",
      };
    }

    case "LOGIN_SUCCESSFULL": {
      return { ...state, Logindata: action.payload, action: "LOGIN" };
    }
    case "LOGIN_ERROR": {
      return { ...state, Logindata: action.payload, action: "LOGIN" };
    }

    case "SOCIAL_LOGIN_SUCCESSFULL": {
      return { ...state, Socialdata: action.payload, action: "SOCIAL_LOGIN" };
    }
    case "SOCIAL_LOGIN_ERROR": {
      return { ...state, Socialdata: action.payload, action: "SOCIAL_LOGIN" };
    }

    case "FORGET_PASSWORD": {
      return {
        ...state,
        data: action.payload,
        action: "FORGET_PASSWORD",
      };
    }

    case "RESET_PASSWORD": {
      return {
        ...state,
        data: action.payload,
        action: "RESET_PASSWORD",
      };
    }

    case "CONTACT_US": {
      return {
        ...state,
        data: action.payload,
        action: "CONTACT_US",
      };
    }

    case "GET_LEADERS_OUTER": {
      return {
        ...state,
        data: action.payload,
        action: "GET_LEADERS_OUTER",
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

export default loginReducer;
