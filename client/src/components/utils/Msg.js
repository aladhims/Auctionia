import React from "react";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar";
import Button from "material-ui/Button";
import * as acts from "../../actions/index";

const Msg = props => {
  const { open, msg } = props.snack;
  console.log(props);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={4000}
      action={
        <Button color="accent" dense>
          Coba Lagi
        </Button>
      }
      onClose={() => props.hideMessage()}
      SnackbarContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{msg}</span>}
    />
  );
};

const mapStateToProps = ({ snack }) => {
  return { snack };
};

export default connect(mapStateToProps, acts)(Msg);
