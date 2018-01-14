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
import "moment/locale/id";
import { Link } from "react-router-dom";
import { toRp } from "../utils";
import Loyalty from "material-ui-icons/Loyalty";
import HourglassEmpty from "material-ui-icons/HourglassEmpty";
import HourglassFull from "material-ui-icons/HourglassFull";
import Timelapse from "material-ui-icons/Timelapse";
import IconButton from 'material-ui/IconButton';
import Slider from 'react-slick';
import Tooltip from 'material-ui/Tooltip';


const styles = theme => ({
  card: {
    width: 400
  },
  media: {
    width: "100%",
    height: 230,
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

class Auction extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderStatus(start,end){
    const now = Date.now();
    if(Moment(now).isBetween(start,end)){
      return (
        <Tooltip title="Sedang Mulai" placement="left">
          <IconButton>
            <HourglassEmpty />
          </IconButton>
        </Tooltip>
      )
    }else if(Moment(now).isBefore(start)){
      return (
        <Tooltip title="Belum Dimulai" placement="left">
          <IconButton>
            <Timelapse />
          </IconButton>
        </Tooltip>
      )
    }else if(Moment(now).isAfter(end)){
      return (
        <Tooltip title="Sudah Selesai" placement="left">
          <IconButton>
            <HourglassFull />
          </IconButton>
        </Tooltip>
      )
    }
  }

  renderImages(images,classes){
    if(images.length > 1){
      return (
        <Slider slideToShow={1} arrows={false} dots={true} infinite={false} >
          {images.map((image,index) => <img className={classes.media} key={index} src={image}/>)}
        </Slider>
      )
    }else{
      return <img className={classes.media} src={images[0]}/>
    }
  }

  render() {
    const { classes, auction } = this.props;
    const start = new Date(auction.start);
    const end = new Date(auction.end);
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
          subheader={Moment(auction.posted).locale('id').fromNow()}
          action={this.renderStatus(start,end)}
        />
        {this.renderImages(auction.photos,classes)}
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
            <Loyalty/>
          </IconButton>
          <Typography type="caption">{auction.category}</Typography>
          <div className={classes.flexGrow} />
          {auction.id ? <Link to={`/app/auction/${auction.id}`} params={auction}>
          <Button dense color="primary">
            Lihat
          </Button>
        </Link> : null}
        </CardActions>
      </Card>
    );
  }
}

Auction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Auction);
