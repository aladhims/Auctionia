import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Auction from "./Auction";
import Search from "material-ui-icons/Search";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import IconButton from "material-ui/IconButton";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Divider from "material-ui/Divider";
import { CircularProgress } from "material-ui/Progress";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import * as acts from "../actions/index";
import { connect } from "react-redux";
import { ALL_AUCTIONS_QUERY, AUCTIONS_BY_CATEGORY, AUCTIONS_BY_TEXT } from "../queries";
import Chip from "material-ui/Chip";
import Sticky from "react-stickynode";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%"
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing.unit * 2
  },
  textFieldRoot: {
    padding: 0,
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  textFieldInput: {
    borderRadius: 4,
    background: theme.palette.common.white,
    border: "1px solid #ced4da",
    height: "80%",
    fontSize: 14,
    padding: 12,
    width: "calc(100% - 24px)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  },
  textFieldFormLabel: {
    fontSize: 18
  },
  progress: {
    margin: "auto",
    position: "relative"
  }
});

class AuctionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kategori: [],
      search: "",
    };

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDeleteFilter = this.handleDeleteFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount(){
    this.props.auctionsQuery.refetch();
  }

  async handleCategoryChange(e) {
    this.setState({ kategori: e.target.value });
    this.props.showLoading();
    const filteredData = await this.props.client.query({
      query: AUCTIONS_BY_CATEGORY,
      variables: { categories: e.target.value }
    });
    this.props.client.writeQuery({
      query: ALL_AUCTIONS_QUERY,
      data: {
        allAuctions: filteredData.data.getAuctionsByCategory
      }
    })
    this.props.hideLoading();
  }

  handleDeleteFilter(data) {
    const kategori = [...this.state.kategori];
    const deleteKategori = kategori.findIndex(k => k === data);
    this.setState({
      kategori: [
        ...kategori.slice(0, deleteKategori),
        ...kategori.slice(deleteKategori + 1)
      ]
    });
  }

  async handleSearch(){
    const { search } = this.state;
    this.props.showLoading();
    const searchResults = await this.props.client.query({
      query: AUCTIONS_BY_TEXT,
      variables: { search }
    });

    await this.props.client.writeQuery({
      query: ALL_AUCTIONS_QUERY,
      data: {
        allAuctions: searchResults.data.getAuctionsByText
      }
    });
    this.props.hideLoading();
  }

  async handleResetFilter(e) {
    this.setState({ kategori: [] });
    this.props.showLoading();
    await this.props.auctionsQuery.refetch();
    this.props.hideLoading();
  }
  render() {
    const { classes, theme } = this.props;
    const categories = [
      "Pakaian",
      "Kendaraan",
      "Antik",
      "Emas",
      "Kerajinan",
      "Property",
      "Elektronik"
    ];
    if (this.props.auctionsQuery && this.props.auctionsQuery.loading) {
      this.props.showLoading();
      return null;
    }

    if (this.props.auctionsQuery && this.props.auctionsQuery.error) {
      this.props.showMessage(this.props.auctionsQuery.error);
      return null;
    }

    this.props.hideLoading();
    const auctions = this.props.auctionsQuery.allAuctions;
    return (
      <Grid item xs={12}>
        <Grid container direction="column" className={classes.root}>
          <Grid item xs={12} sm={12} md={12} style={{ marginBottom: 16 }}>
            <Sticky innerZ={100000} top={12}>
              <Grid container direction="column" alignItems="center">
                <div style={{ width: "70%", display: "flex" }}>
                  <FormControl fullWidth>
                    <Input
                      className={classes.textFieldInput}
                      id="amount"
                      value={this.state.search}
                      onChange={e => this.setState({search: e.target.value})}
                      disableUnderline={true}
                      placeholder="Cari Lelang..."
                    />
                  </FormControl>
                  <Button raised color="accent" onClick={this.handleSearch}>
                    <Search />
                  </Button>
                </div>
              </Grid>
            </Sticky>
          </Grid>
          <Divider style={{ height: 3 }} />
          <Grid item xs={12} sm={12} md={12}>
            <Grid container direction="row">
              <Grid
                item
                xs={12}
                sm={8}
                md={8}
                style={{ marginTop: 16, borderRight: "solid 3px #e0e0e0" }}
              >
                <Grid
                  container
                  className={classes.root}
                  justify="space-around"
                  spacing={24}
                  style={{ overflow: "scroll" }}
                >
                  {auctions.map(auct => (
                    <Grid
                      key={auct.id}
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={4}
                    >
                      <Auction auction={auct} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} md={4} style={{ marginTop: 16 }}>
                <Sticky top={80}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    alignContent="space-between"
                    spacing={24}
                    style={{ padding: 16 }}
                  >
                    <div
                      style={{
                        maxWidth: "100%",
                        display: "flex",
                        direction: "row"
                      }}
                    >
                      {this.state.kategori.map((cat, index) => {
                        return (
                          <Chip style={{ margin: 8,backgroundColor: "#40C4FF", color: "white" }} label={cat} key={index} />
                        );
                      })}
                      {this.state.kategori.length > 0 ? (
                        <Chip
                          style={{ margin: 8 }}
                          label="hapus filter"
                          onDelete={this.handleResetFilter}
                          key={22}
                        />
                      ) : null}
                    </div>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="name-multiple">Kategori</InputLabel>
                      <Select
                        multiple
                        value={this.state.kategori}
                        onChange={this.handleCategoryChange}
                        input={<Input id="name-multiple" />}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              width: 200
                            }
                          }
                        }}
                      >
                        {categories.map(name => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={{
                              fontWeight:
                                this.state.kategori.indexOf(name) === -1
                                  ? theme.typography.fontWeightRegular
                                  : theme.typography.fontWeightMedium
                            }}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Sticky>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AuctionList.propTypes = {
  classes: PropTypes.object.isRequired
};

const theComponent = withStyles(styles, { withTheme: true })(AuctionList);
export default connect(null, acts)(
  withApollo(
    graphql(ALL_AUCTIONS_QUERY, { name: "auctionsQuery" })(theComponent)
  )
);
