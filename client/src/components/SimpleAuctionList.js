import React, { Component } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Typography from "material-ui/Typography";
import Moment from "moment";
import ListSubheader from "material-ui/List/ListSubheader";
import List from "material-ui/List";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    minWidth: "70%",
    background: theme.palette.background.paper,
    overflow: "auto",
    minHeight: "65vh"
  },
  listSection: {
    background: "inherit"
  }
});

const SimpleAuction = myAuction => {
  return (
    <Link to={`/app/auction/${myAuction.myAuction.id}`}>
      <ListItem divider={true}>
        <Avatar
          src={myAuction.myAuction.photos[0]}
          alt={myAuction.myAuction.title}
        />
        <ListItemText
          primary={myAuction.myAuction.title}
          secondary={Moment(myAuction.myAuction.posted).fromNow()}
        />
        <ListItemSecondaryAction style={{ padding: 8 }}>
          <Typography type="subheading">
            {myAuction.myAuction.status}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
};

class SimpleAuctionList extends Component {
  render() {
    const { classes, theAucts } = this.props;
    return (
      <List className={classes.root}>
        <div className={classes.listSection}>
          {theAucts.map((auct, index) => (
            <SimpleAuction key={index} myAuction={auct} />
          ))}
        </div>
      </List>
    );
  }
}

export default withStyles(styles)(SimpleAuctionList);
