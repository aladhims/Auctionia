import React, { Component } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Route } from "react-router-dom";
import Ldng from "./components/utils/Ldng";
import Msg from "./components/utils/Msg";
import Firebase from "firebase";

var config = {
  apiKey: "AIzaSyB6ofC6X48b2-D23ktf76oCJ1uE4G45OK0",
  projectId: "agentconnector",
  storageBucket: "agentconnector.appspot.com"
};

class App extends Component {
  componentDidMount() {
    Firebase.initializeApp(config);
  }
  render() {
    return (
      <div>
        <Ldng />
        <Route
          exact
          path="/login"
          component={routeProps => (
            <Login {...routeProps} error={this.handleOpenSnack} />
          )}
        />
        <Route
          exact
          path="/signup"
          component={routeProps => (
            <Signup {...routeProps} error={this.handleOpenSnack} />
          )}
        />
        <Route path="/app" component={Header} />
        <Msg />
      </div>
    );
  }
}

export default App;
