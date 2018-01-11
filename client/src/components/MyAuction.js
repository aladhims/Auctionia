import React from 'react';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import PhoneIcon from 'material-ui-icons/Phone';
import FavoriteIcon from 'material-ui-icons/Favorite';
import Divider from 'material-ui/Divider';
import PersonPinIcon from 'material-ui-icons/PersonPin';
import { MY_AUCTIONS } from '../queries';
import { graphql } from 'react-apollo';
import SimpleAuctionList from './SimpleAuctionList';
import SwipeableViews from 'react-swipeable-views';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Link } from 'react-router-dom'

class MyAuction extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };


  render() {
    const { myAuctions } = this.props;
    if(myAuctions && myAuctions.loading){
      return null;
    }
    const {auctions, participations} = myAuctions.currentUser;
    
    return (
      <div>
        <div style={{width: '80%', margin: '32px auto'}}>
          <Paper>
              <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  fullWidth
                  indicatorColor="accent"
                  textColor="accent"
                  centered
              >
                  <Tab icon={<PhoneIcon />} label="Milik Saya" />
                  <Tab icon={<PersonPinIcon />} label="Partisipasi Saya" />
              </Tabs>
          </Paper>
          <Divider/>
          <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          >
            <SimpleAuctionList theAucts={auctions}/>
            <SimpleAuctionList theAucts={participations}/>
          </SwipeableViews>
        </div>
        <Link to="/app/myauction/create">
          <Button fab color="primary" aria-label="add" style={{
            position: 'absolute',
            bottom: 32,
            right: 32
          }}>
            <AddIcon />
          </Button>
        </Link>
      </div>
    );
  }
}


export default graphql(MY_AUCTIONS,{name: "myAuctions"})(MyAuction);