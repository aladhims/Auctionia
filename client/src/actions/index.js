import * as actions from "./type";

export const showLoading = () => {
  return {
    type: actions.SHOW_LOADING
  };
};

export const hideLoading = () => {
  return {
    type: actions.HIDE_LOADING
  };
};

export const showMessage = message => {
  return {
    type: actions.SNACKBAR_AVAIL,
    message
  };
};

export const hideMessage = () => {
  return {
    type: actions.SNACKBAR_DISMISS
  };
};
