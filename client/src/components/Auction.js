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
import People from "material-ui-icons/People";
import Grade from "material-ui-icons/Grade";
import Timelapse from "material-ui-icons/Timelapse";
import IconButton from "material-ui/IconButton";
import Slider from "react-slick";
import Tooltip from "material-ui/Tooltip";


const styles = theme => ({
  card: {
    width: 400,
  },
  media: {
    width: "100%",
    height: 230
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

const Trophy = () => {
  return (
    <svg style={{ width: 24, height: 24, marginRight: 8 }} viewBox="0 0 24 24">
      <path
        fill="#FBC02D"
        d="M5.627 19.027l2.265 3.359c-.643.448-1.219.991-1.708 1.614l-.48-2.506h-2.704c.745-.949 1.631-1.782 2.627-2.467zm12.746 0l-2.265 3.359c.643.448 1.219.991 1.708 1.614l.48-2.506h2.704c-.745-.949-1.631-1.782-2.627-2.467zm-6.373-2.388c-2.198 0-4.256.595-6.023 1.632l2.271 3.368c1.118-.607 2.396-.948 3.752-.948s2.634.34 3.752.948l2.271-3.368c-1.767-1.037-3.825-1.632-6.023-1.632zm-2.341 3.275l-.537-.287-.536.287.107-.599-.438-.421.602-.083.265-.547.266.547.603.083-.438.421.106.599zm3.149-.115l-.818-.438-.82.438.164-.915-.671-.643.921-.127.406-.835.405.835.92.127-.671.643.164.915zm2.583.115l-.536-.287-.536.287.106-.599-.438-.421.603-.083.266-.547.265.547.603.083-.438.421.105.599zm2.618-10.258c-.286.638-.585 1.231-.882 1.783 4.065-1.348 6.501-5.334 6.873-9.439h-4.077c-.036.482-.08.955-.139 1.405h2.688c-.426 2.001-1.548 4.729-4.463 6.251zm-6.009 5.983c.577 0 1.152.039 1.721.115 1.221-3.468 5.279-6.995 5.279-15.754h-14c0 8.758 4.065 12.285 5.29 15.752.564-.075 1.136-.113 1.71-.113zm-2.951-13.639c.011 3.621.76 7.793 2.646 11.053-2.355-2.72-4.14-6.405-4.345-11.053h1.699zm-2.176 9.438c-.297-.552-.596-1.145-.882-1.783-2.915-1.521-4.037-4.25-4.464-6.251h2.688c-.058-.449-.102-.922-.138-1.404h-4.077c.372 4.105 2.808 8.091 6.873 9.438z"
      />
    </svg>
  );
};

class Auction extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderStatus(start, end) {
    const now = Date.now();
    if (Moment(now).isBetween(start, end)) {
      return (
        <Tooltip title="Sedang Mulai" placement="left">
          <IconButton>
            <HourglassEmpty />
          </IconButton>
        </Tooltip>
      );
    } else if (Moment(now).isBefore(start)) {
      return (
        <Tooltip title="Belum Dimulai" placement="left">
          <IconButton>
            <Timelapse />
          </IconButton>
        </Tooltip>
      );
    } else if (Moment(now).isAfter(end)) {
      return (
        <Tooltip title="Sudah Selesai" placement="left">
          <IconButton>
            <HourglassFull />
          </IconButton>
        </Tooltip>
      );
    }
  }

  renderImages(images, classes) {
    if (images.length > 1) {
      return (
        <Slider slideToShow={1} arrows={false} dots={true} infinite={false}>
          {images.map((image, index) => (
            <img className={classes.media} key={index} src={image} />
          ))}
        </Slider>
      );
    } else {
      return <img className={classes.media} src={images[0]} />;
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
          subheader={Moment(auction.posted).fromNow()}
          action={this.renderStatus(start, end)}
        />
        {this.renderImages(auction.photos, classes)}
        <CardContent style={{marginTop: 16}}>
          <Typography
            type="headline"
            component="h1"
            gutterBottom={true}
          >
            {auction.title}
          </Typography>
          <div
            style={{ display: "flex", alignItems: "center"}}
          >
            <Tooltip title="Pemenang" placement="bottom">
              <IconButton>
                <Trophy />
              </IconButton>
            </Tooltip>
            <Typography component="p">
              {auction.winner ? auction.winner.name : "Belum Ada"}
            </Typography>
          </div>
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
            <Loyalty />
          </IconButton>
          <Typography type="caption">{auction.category}</Typography>
          <IconButton style={{ marginLeft: 8 }}>
            <People />
          </IconButton>
          <Typography type="caption">
            {auction.bidders.length} Penawar
          </Typography>
          <div className={classes.flexGrow} />
          {auction.id ? (
            <Link to={`/app/auction/${auction.id}`} params={auction}>
              <Button dense color="primary">
                Lihat
              </Button>
            </Link>
          ) : null}
        </CardActions>
      </Card>
    );
  }
}

Auction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Auction);
