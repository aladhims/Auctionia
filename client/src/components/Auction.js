import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card";
import Avatar from "material-ui/Avatar";
import Typography from "material-ui/Typography";
import red from "material-ui/colors/red";
import { FormControlLabel } from "material-ui/Form";
import Switch from "material-ui/Switch";
import green from "material-ui/colors/green";
import Button from "material-ui/Button";
import Moment from "moment";
import { Link } from "react-router-dom";
import { toRp } from "../utils";
import BookmarkBorder from "material-ui-icons/BookmarkBorder";
import IconButton from 'material-ui/IconButton';

const styles = theme => ({
  card: {
    width: 400
  },
  media: {
    height: 194
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  flexGrow: {
    flex: "1 1 auto"
  },
  bar: {},
  checked: {
    color: green[500],
    "& + $bar": {
      backgroundColor: green[500]
    }
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  }
});

class RecipeReviewCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, auction } = this.props;
    const start = new Date(auction.start);
    const end = new Date(auction.end);
    const isProgressing = Moment(Date.now()).isBetween(start.getTime(),end.getTime());
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              alt={auction.name}
              src={auction.by.photo}
              aria-label="Recipe"
              className={classes.avatar}
            />
          }
          title={auction.by.name}
          subheader={Moment(auction.start).fromNow()}
          action={
            <FormControlLabel
              control={
                <Switch
                  classes={{
                    checked: classes.checked,
                    bar: classes.bar
                  }}
                  disabled={true}
                  checked={isProgressing ? true : false}
                />
              }
              label={isProgressing ? "Berlangsung" : "Tidak Aktif"}
            />
          }
        />
        <CardMedia
          className={classes.media}
          image={auction.photo}
          title={auction.title}
        />
        <CardContent>
          <Typography
            type="headline"
            component="h4"
            color="accent"
            gutterBottom={true}
          >
            {auction.title}
          </Typography>
          <Typography gutterBottom={true} className={classes.pos}>
            Harga Awal :{" "}
            <em>
              <b>{toRp(auction.currentprice)}</b>
            </em>
          </Typography>
          <Typography component="p">{auction.description}</Typography>
        </CardContent>
        <CardActions disableActionSpacing>
          <IconButton>
            <BookmarkBorder/>
          </IconButton>
          <Typography type="caption">{auction.category}</Typography>
          <div className={classes.flexGrow} />
          <Link to={`/app/auction/${auction.id}`} params={auction}>
            <Button dense color="primary">
              Lihat
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecipeReviewCard);
