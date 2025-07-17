import ActionTypes from './actionTypes';
import serviceHandler from '../core/services/serviceHandler';

export const ChangeActiveRoute = route => {
  return dispatch => {
    dispatch({ type: ActionTypes.CHANGEACTIVEROUTE, payload: route });
  };
};

export const ChangeNewUser = bool => {
  return dispatch => {
    dispatch({ type: ActionTypes.NEWUSER, payload: bool });
  };
};

export const ChangeLastRoute = route => {
  return dispatch => {
    dispatch({ type: ActionTypes.LASTPATH, payload: route });
  };
};

export const ChangeVideoUploading = bool => {
  return dispatch => {
    dispatch({ type: ActionTypes.VIDEOUPLOADING, payload: bool });
  };
};

var AbortController, controller, signal;

export const Upload = async file => {
  AbortController = window.AbortController;
  controller = new AbortController();
  signal = controller.signal;

  let head = new Headers();
  var data = new FormData();
  data.append(file.name, file);

  let res = await serviceHandler.post(
    'files/upload?type=html',
    data,
    head,
    signal
  );
  if (res.status === 200) return { status: true, videoId: res.body };
  return { status: false, mesg: res.body };
};

export const AbortFetching = () => {
  controller.abort();
};

export const ChangeRequestedRoute = route => {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUESTEDROUTE, payload: route });
  };
};

export const ChangeUser = user => {
  return dispatch => {
    dispatch({ type: ActionTypes.USER, payload: user });
  };
};

export const ChangeProfile = profile => {
  return dispatch => {
    dispatch({ type: ActionTypes.PROFILE, payload: profile });
  };
};

export const FeedBackStatus = bool => {
  return dispatch => {
    dispatch({ type: ActionTypes.FEEDBACK, payload: bool });
  };
};

export const ViewSnippet = view => {
  return dispatch => {
    dispatch({ type: ActionTypes.VIEWTYPE, payload: view });
  };
};

export const FeedBack = feedback => {
  return async dispatch => {
    var res = await serviceHandler.post(
      'sys/feedback',
      JSON.stringify(feedback)
    );
    if (res.status !== 200) {
      dispatch({ type: ActionTypes.FEEDBACK, payload: false });
      return false;
    } else {
      dispatch({ type: ActionTypes.FEEDBACK, payload: true });
      return true;
    }
  };
};
