import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List from "material-ui/List";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import VerticalAlignBottom from "material-ui-icons/VerticalAlignBottom";
import Home from "material-ui-icons/Home";
import Gavel from "material-ui-icons/Gavel";
import Person from "material-ui-icons/Person";
import AddBox from "material-ui-icons/AddBox";
import AttachMoney from "material-ui-icons/AttachMoney";
import Close from "material-ui-icons/Close";
import { styles } from "../styles";
import { GQL_JWT_TOKEN, GQL_USER_ID } from "../constants";
import AuctionList from "./AuctionList";
import BiddingRoom from "./BiddingRoom";
import MyAuction from "./MyAuction";
import CreateAuction from "./CreateAuction";
import { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import { Route, Link } from "react-router-dom";
import { withApollo } from "react-apollo";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.client.resetStore();
    //remove token and user id so that it will be render and send back the user to the login page
    localStorage.removeItem(GQL_JWT_TOKEN);
    localStorage.removeItem(GQL_USER_ID);
    this.props.history.push("/login");
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const token = localStorage.getItem(GQL_JWT_TOKEN);
    if (!token) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { classes, theme, match } = this.props;
    console.log(this.props);
    return (
      <div className={classes.root}>
        <AppBar position="fixed" style={{zIndex: 5}}>
          <Toolbar>
            <IconButton
              onClick={() => this.setState({ open: true })}
              className={classes.menuButton}
              color="contrast"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Auctionia
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="bottom"
          onClose={() => this.setState({ open: false })}
          open={this.state.open}
        >
          <div
            style={{ width: "auto" }}
            tabIndex={0}
            role="button"
            onClick={() => this.setState({ open: false })}
            onKeyDown={() => this.setState({ open: false })}
          >
            <List>
              <div>
                <Link to="/app">
                  <ListItem button>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText primary="Beranda" />
                  </ListItem>
                </Link>
                <ListItem button>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Profil" />
                </ListItem>
                <Link to="/app/myauction">
                  <ListItem button>
                    <ListItemIcon>
                      <Gavel />
                    </ListItemIcon>
                    <ListItemText primary="Lelang" />
                  </ListItem>
                </Link>
                <ListItem button>
                  <ListItemIcon>
                    <AttachMoney />
                  </ListItemIcon>
                  <ListItemText primary="Rp. 150.000.000" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <VerticalAlignBottom />
                  </ListItemIcon>
                  <ListItemText primary="Top Up" />
                </ListItem>
              </div>
            </List>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={this.handleLogout}>
                  <ListItemIcon>
                    <Close />
                  </ListItemIcon>
                  <ListItemText primary="Keluar" />
                </ListItem>
              </div>
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Route exact path={`${match.url}/myauction`} component={MyAuction} />
          <Route exact path={match.url} component={AuctionList} />
          <Route
            exact
            path={`${match.url}/auction/:id`}
            component={BiddingRoom}
          />
          <Route
            exact
            path={`${match.url}/myauction/create`}
            component={CreateAuction}
          />
        </main>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withApollo(withStyles(styles, { withTheme: true })(Header));
