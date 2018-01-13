import * as acts from "../actions/type";

export default (
  state = { loading: false, snack: { open: false, msg: "" } },
  actions
) => {
  switch (actions.type) {
    case acts.SHOW_LOADING:
      return { ...state, loading: true };
    case acts.HIDE_LOADING:
      return { ...state, loading: false };
    case acts.SNACKBAR_AVAIL:
      return { ...state, snack: { open: true, msg: actions.message } };
    case acts.SNACKBAR_DISMISS:
      return { ...state, snack: { open: false, msg: "" } };
    default:
      return state;
  }
};
