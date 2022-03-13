const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
//importing middeware
const { authMiddleware } = require("./utils/auth");
//import to serve up the React front-end code in production
const path = require("path");

/*database connection being imported from the connection.js file in the config directory and stored in the variable db*/
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  // Start the Apollo server
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets and checks if app is in production environment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

/*when we run the server, we listen for the a successfull db connection using db.open() / or db.once() and once the connection is successful the server starts*/
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

/**We just added two important pieces of code that will only come into effect when we go into production. First, we check to see if the Node environment is in production. If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder. We don't have a build folder yet—because remember, that's for production only!

The next set of functionality we created was a wildcard GET route for the server i.e app.get('*'. In other words, if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code.
 
The new ApolloServer() function (startServer()), we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests. There are more parameters we could pass in, but these are the two we really need to get started.

We then connect our Apollo server to our Express.js server. This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API. That's not all—the /graphql endpoint also has a built-in testing tool we can use */
