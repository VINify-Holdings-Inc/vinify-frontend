import ActionTypes from '../actions/actionTypes';

import site from '../sitemap';

const initial_state = {
  Sitemap: site,
  LastPath: '',
  FeedBackResponse: null,
  RequestedRoute: '/',
  ActiveRoute: { ...site.routes.home }
};

const FlagReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ActionTypes.CHANGEACTIVEROUTE:
      return {
        ...state,
        ActiveRoute: action.payload
      };
    case ActionTypes.REQUESTEDROUTE:
      return {
        ...state,
        RequestedRoute: action.payload
      };
    case ActionTypes.FEEDBACK:
      return {
        ...state,
        FeedBackResponse: action.payload
      };
    case ActionTypes.LASTPATH:
      return {
        ...state,
        LastPath: action.payload
      };
    default:
      return state;
  }
};
export default FlagReducer;
