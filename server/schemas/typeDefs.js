/* import graphQL / gql tagged template function from apollo-server-express. Tagged templates are an advanced use of template literals (ES6)*/
const { gql } = require("apollo-server-express");

// create our typeDefs for User and Thoughts
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;
/* Notice the ! after the query parameter data type it indicates that for that query to be carried out, that data must exist. Apollo will return an error to the client making the request and the query won't even reach the resolver function*/
/*we're instructing our query that we'll return an array, as noted by the [] square brackets around the returning data, [Thought] and [User]. With this custom data type, we are able to instruct the thoughts query so that each thought that returns can include _id, thoughtText, username, and reactionCount fields with their respective GraphQL scalars. The new data types, ID and Int; ID is essentially the same as String except that it is looking for a unique identifier; and Int is simply an integer.
 */

// export the typeDefs
module.exports = typeDefs;
