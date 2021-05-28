import { CANVAS_SIZE, CATEGORY } from "../Actions/HomeActions";

const HomeState = (state = { data: "", status: "" }, action) => {
  switch (action.type) {
    case CANVAS_SIZE:
      return {
        ...state,
        data: action.data,
      };

    case CATEGORY:
      return {
        ...state,
        category: action.category,
      };

    default:
      return state;
  }
};

export default HomeState;
