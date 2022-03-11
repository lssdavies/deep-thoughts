/*This file is handling the connecetion to MongoDB and exporting it to the server.js file, instead of connect directly in the server.js file*/
const mongoose = require("mongoose");

/*Due to node version cannot use for mongodb://localhost/<db-name>> have to replace local host with 127.0.0.1*/
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1/deep-thoughts",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
