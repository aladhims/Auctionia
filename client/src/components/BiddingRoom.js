import React, { Component } from "react";
import Grid from "material-ui/Grid";
import Auction from "./Auction";
import BidList from "./BidList";
import { graphql, compose } from "react-apollo";
import { BIDS_SUBS, AUCTION_DETAILS, CREATE_BID, UPDATE_BID } from "../queries";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import PropTypes from "prop-types";
import { FormControl, FormHelperText } from "material-ui/Form";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";
import { GQL_USER_ID } from "../constants";
import green from "material-ui/colors/green";
import Button from "material-ui/Button";
import { updateQuery } from "../utils";
import * as acts from "../actions/index";
import { connect } from "react-redux";


const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  wrapper: {
    margin: theme.spacing.unit
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%"
  }
});

class BiddingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myBid: 0,
      loading: false,
      success: false,
      perbaruiText: "Perbarui Penawaran"
    };

    this.handleUpdateBid = this.handleUpdateBid.bind(this);
  }
  componentDidMount() {
    this._subscribeBidMutation();
  }
  _subscribeBidMutation = () => {
    const auctionId = this.props.bidsQuery.variables.id;
    this.props.bidsQuery.subscribeToMore({
      document: BIDS_SUBS,
      variables: { auctionId },
      updateQuery
    });
  };

  handleChangeBid = event => {
    this.setState({
      myBid: event.target.value,
      error: false,
      errMsg: ""
    });
  };

  handleUpdateBid = () => {
    const auctionId = this.props.bidsQuery.variables.id;
    const { myBid } = this.state;
    const bidsAmount = this.props.bidsQuery.getAuction.bidders.map(
      bid => bid.amount
    );
    const highestBid = Math.max.apply(null, bidsAmount);
    if (myBid <= highestBid) {
      this.setState({
        error: true,
        errMsg: "Tawaran anda terlalu rendah"
      });
      return;
    }
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
          perbaruiText: "Memperbarui Penawaran"
        },
        async function() {
          const myId = localStorage.getItem(GQL_USER_ID).toString();
          const bidders = this.props.bidsQuery.getAuction.bidders;
          const checkMyId = bidders.findIndex(b => b.byId === myId);
          const { myBid } = this.state;
          const amount = parseInt(myBid);
          if (checkMyId === -1) {
            console.log("TEST CREATED");
            await this.props.bidsCreate({
              variables: {
                amount,
                auctionId
              }
            });
          } else {
            console.log("UPDATED");
            const myBid = bidders.find(function(b) {
              return b.byId === myId;
            });
            const bidId = myBid.id;
            await this.props.bidsUpdate({
              variables: {
                amount,
                id: bidId
              }
            });
          }

          this.setState(
            {
              loading: false,
              success: true,
              perbaruiText: "Penawaran Diperbarui"
            },
            () => {
              setTimeout(() => {
                this.setState({
                  loading: false,
                  success: false,
                  perbaruiText: "Perbarui Penawaran"
                });
              }, 1000);
            }
          );
        }
      );
    }
  };

  render() {
    const { classes, bidsQuery } = this.props;
    if (bidsQuery && bidsQuery.loading) {
      this.props.showLoading();
      return null;
    }
    this.props.hideLoading();
    const { success, loading } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success
    });

    const isMine = localStorage.getItem(GQL_USER_ID).toString() === bidsQuery.getAuction.by.id.toString();
    console.log(localStorage.getItem(GQL_USER_ID),bidsQuery.getAuction.by.id)
    const disabled = isMine || loading;
    return (
      <Grid
        item
        xs={12}
        style={{ marginTop: 24, height: "calc(100vh - 130px)" }}
      >
        <Grid container alignItems="center" direction="row">
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid
              container
              justify="center"
              alignItems="center"
              direction="column"
            >
              <Auction auction={bidsQuery.getAuction} />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Grid container justify="center" alignItems="stretch">
              <BidList theBids={bidsQuery.getAuction.bidders} />
              {isMine ? null : (
                <Grid container direction="row" justify="center" spacing={24}>
                  <FormControl
                    margin="normal"
                    error={this.state.error}
                    aria-describedby="name-error-text"
                  >
                    <InputLabel htmlFor="bid">Penawaran Anda</InputLabel>
                    <Input
                      id="bid"
                      startAdornment={
                        <InputAdornment position="start">Rp. </InputAdornment>
                      }
                      placeholder="Masukkan Penawaran Anda"
                      value={this.state.myBid}
                      onChange={this.handleChangeBid}
                      inputProps={{
                        "aria-label": "Description"
                      }}
                    />
                    <FormHelperText id="name-error-text">
                      {this.state.errMsg}
                    </FormHelperText>
                  </FormControl>
                  <div className={classes.root}>
                    <div className={classes.wrapper}>
                      <Button
                        raised
                        color="primary"
                        className={buttonClassname}
                        disabled={loading}
                        onClick={this.handleUpdateBid}
                      >
                        {this.state.perbaruiText}
                      </Button>
                      {loading && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const gqlOperations = compose(
  graphql(AUCTION_DETAILS, {
    name: "bidsQuery",
    options: ({ location: { pathname } }) => ({
      variables: { id: pathname.split("/")[3].toString() }
    })
  }),
  graphql(CREATE_BID, {
    name: "bidsCreate"
  }),
  graphql(UPDATE_BID, {
    name: "bidsUpdate"
  })
);
export default connect(null, acts)(
  gqlOperations(withStyles(styles)(BiddingRoom))
);
