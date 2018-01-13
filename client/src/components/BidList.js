import React, { Component } from "react";
import ListSubheader from "material-ui/List/ListSubheader";
import List from "material-ui/List";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Bidder from "./Bidder";
import Paper from "material-ui/Paper";
import FlipMove from "react-flip-move";
import randomColor from "randomcolor";

const styles = theme => ({
  root: {
    width: "100%",
    minWidth: 200,
    maxWidth: "70vh",
    background: theme.palette.background.paper,
    overflow: "auto",
    minHeight: "50vh",
    maxHeight: "70vh",
    marginBottom: 24
  },
  listSection: {
    background: "inherit"
  }
});
const colors = randomColor({
  count: 10,
  luminosity: "dark",
  hue: "random"
});

class BidList extends Component {
  render() {
    const { classes, theBids } = this.props;
    return (
      <List className={classes.root} subheader={<div />}>
        <div className={classes.listSection}>
          <ListSubheader component={Paper}>Penawar Barang ini</ListSubheader>
          <FlipMove duration={750} easing="ease-out">
            {theBids.map((bid, index) => (
              <Bidder
                myBid={bid}
                key={bid.id}
                rank={index}
                color={colors[index]}
              />
            ))}
          </FlipMove>
        </div>
      </List>
    );
  }
}

BidList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BidList);
