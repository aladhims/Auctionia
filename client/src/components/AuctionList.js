import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Auction from './Auction';
import Search from 'material-ui-icons/Search';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import { CircularProgress } from 'material-ui/Progress';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import * as acts from '../actions/index';
import {connect} from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%'
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  textFieldInput: {
    borderRadius: 4,
    background: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '0 6px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  textFieldFormLabel: {
    fontSize: 18,
  },
  progress: {
    margin: 'auto',
    position: 'relative'
  },
});

class AuctionList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            kategori: "kategori"
        }
    }
  render() {
    const { classes } = this.props;
    const categories = ['Pakaian','Kendaraan','Emas','Barang Antik', 'Properti','Elektronik']
    if(this.props.auctionsQuery && this.props.auctionsQuery.loading){
        this.props.showLoading();
        return null;
    }

    if(this.props.auctionsQuery && this.props.auctionsQuery.error) {
        this.props.showMessage(this.props.auctionsQuery.error);
        return null;
    }

    this.props.hideLoading();
    const auctions = this.props.auctionsQuery.allAuctions;
    console.log(this.props.auctionsQuery);
    return (
            <Grid item xs={12}>
                <Grid container direction="column" className={classes.root}>
                    <Grid item xs={12} sm={12} md={12} style={{marginBottom: 16}}>
                        <Grid container direction="row" alignItems="center">
                            <Grid key={1} item xs={12} sm={4} md={4} lg={4}>
                                <FormControl fullWidth>
                                    <Input
                                        className={classes.textFieldInput}
                                        id="amount"
                                        disableUnderline={true}
                                        placeholder="Cari Lelang..."
                                        endAdornment={<InputAdornment position="end">
                                                <IconButton>
                                                    <Search/>
                                                </IconButton>
                                            </InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid key={2} item xs={6} sm={3} md={3} lg={2}>
                                <Paper elevation={2} style={{padding: 8}}>
                                    <Select
                                        fullWidth
                                        value={this.state.kategori}
                                        onChange={e => this.setState({kategori: e.target.value})}
                                        input={<Input name="age" id="age-simple" />}>
                                        <MenuItem value="kategori" key={1024}>Kategori</MenuItem>
                                        {categories.map((category,key) => <MenuItem key={key} value={category}>{category}</MenuItem>)}
                                    </Select>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider style={{height: 3}}/>
                    <Grid item xs={12} sm={12} md={12} style={{marginTop: 16}}>
                        <Grid container className={classes.root} justify="space-around" spacing={24} style={{overflow: 'scroll'}}>
                            {auctions.map(auct => (
                                <Grid key={auct.id} item xs={12} sm={6} md={4} lg={4} xl={2} >
                                    <Auction auction={auct}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
      
    );
  }
}

AuctionList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ALL_AUCTIONS_QUERY = gql`
  query AllAuctionsQuery {
    allAuctions {
        id
        title
        description
        currentprice
        photo
        start
        end
        status
        by {
          name
          photo
          
        }
    }
  }`

const theComponent = withStyles(styles)(AuctionList);
export default connect(null,acts)(graphql(ALL_AUCTIONS_QUERY, {name: 'auctionsQuery'})(theComponent));