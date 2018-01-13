import React, { Component } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Typography from "material-ui/Typography";
import { toRp } from "../utils";
import { GQL_USER_ID } from "../constants";

class Bidder extends Component {
  render() {
    const { myBid, rank, color } = this.props;
    const myId = localStorage.getItem(GQL_USER_ID);
    const isMine = myId.toString() === myBid.byId.toString();
    return (
      <ListItem divider={true}>
        <Avatar src={myBid.by.photo} alt={myBid.by.name} />
        <ListItemText
          primary={isMine ? "Anda" : myBid.by.name}
          secondary={`${isMine ? "Anda" : ""} Menawar: ${toRp(myBid.amount)}`}
        />
        <ListItemSecondaryAction>
          <Typography type="headline" style={{ color }}>
            #{rank + 1}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Bidder;
