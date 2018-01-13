import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { GQL_JWT_TOKEN, GQL_USER_ID } from "../constants";
import * as acts from "../actions/index";
import { connect } from "react-redux";
import { LOGIN_MUTATION } from "../queries";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  _saveUserData = (id, token) => {
    localStorage.setItem(GQL_USER_ID, id);
    localStorage.setItem(GQL_JWT_TOKEN, token);
  };
  async handleLogin(e) {
    e.preventDefault();
    const { username, password } = this.state;

    this.props.showLoading();

    try {
      const result = await this.props.authenticate({
        variables: {
          username,
          password
        }
      });
      const token = result.data.authenticateUser.token;
      const id = result.data.authenticateUser.user.id;
      this._saveUserData(id, token);
      this.props.history.push("/app");
      this.props.hideLoading();
    } catch (err) {
      console.log(err);
      console.log(
        err.message
          .split(" ")
          .splice(2)
          .join(" ")
      );
      this.props.hideLoading();
      this.props.showMessage(
        err.message
          .split(" ")
          .splice(2)
          .join(" ")
      );
    }
  }
  render() {
    console.log(this.props);
    return (
      <div className="login-page">
        <div className="form">
          <form className="login-form" ref="toggle">
            <input
              type="text"
              placeholder="username"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
            />
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
            <button onClick={this.handleLogin}>Masuk</button>
            <p className="message">
              Belum Daftar? <Link to="/signup">Buat Akun</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(null, acts)(
  graphql(LOGIN_MUTATION, { name: "authenticate" })(Login)
);
