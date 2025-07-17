import ActionTypes from '../actions/actionTypes';

const initial_state = {
  User: {
    email: null,
    phoneNumber: null,
    fullName: null
  },
  Profile: {}
};

const UserReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ActionTypes.USER:
      return {
        ...state,
        User: action.payload
      };
    case ActionTypes.PROFILE:
      return {
        ...state,
        Profile: action.payload
      };
    default:
      return state;
  }
};
export default UserReducer;
