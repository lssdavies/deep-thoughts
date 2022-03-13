import React from "react";
import {
  ApolloProvider /*is a special type of React component that we'll use to provide data to all of the other components.*/,
  ApolloClient /**is a constructor function that will help initialize the connection to the GraphQL API server. */,
  InMemoryCache /** enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.*/,
  createHttpLink,
} from "@apollo/client"; /** allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.*/

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

/** establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink().
 * URI stands for "Uniform Resource Identifier." Along with this step in the package.json file in the client directory. Once that's open, add one more key-value pair towards the top of the JSON object that looks like the following code: "proxy": "http://localhost:3001", */

const httpLink = createHttpLink({
  uri: "/graphql",
});

/**the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint. We also instantiate a new cache object using new InMemoryCache(). */
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

/**wrap returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value for the client prop in the provider, everything between the JSX tags will have access to the server's API data through the client  */

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
/** With this proxy value in place, the Create React App team set up the development server to prefix all HTTP requests using relative paths (e.g., /graphql instead of http://localhost:3001/graphql) with whatever value is provided to it. Now the HTTP requests will work in both development and production environments! */
