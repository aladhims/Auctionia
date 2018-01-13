import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-client-preset";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { GQL_JWT_TOKEN } from "./constants";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import displayReducer from "./reducers/displayReducers";
import ReduxLogger from "redux-logger";

const httpLink = new HttpLink({
  uri: "http://localhost:8070/graphql",
  credentials: "include"
});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(GQL_JWT_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8070/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(GQL_JWT_TOKEN)
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithAuthToken
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

const store = createStore(
  displayReducer,
  { loading: false, snack: { open: false, msg: "" } },
  applyMiddleware(ReduxLogger)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
