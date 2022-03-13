/* import graphQL / gql tagged template function from apollo-server-express. Tagged templates are an advanced use of template literals (ES6)*/
const { gql } = require("apollo-server-express");

// create our typeDefs for User and Thoughts
/* The ! after the query parameter data type indicates that for that query to be carried out, that data must exist. Apollo will return an error to the client making the request and the query won't even reach the resolver function*/
/*we're instructing our query that we'll return an array, as noted by the [] square brackets around the returning data, [Thought] and [User]. With this custom data type, we are able to instruct the thoughts query so that each thought that returns can include _id, thoughtText, username, and reactionCount fields with their respective GraphQL scalars. The new data types, ID and Int; ID is essentially the same as String except that it is looking for a unique identifier; and Int is simply an integer.
 */
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
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;
/* Mutations are used to perform POST,PUT and DELETE function. Queries are used for GET request.type Auth Now that we have a way to generate tokens, we need to update the GraphQL type definitions to include it. A token isn't part of the User model. So instead create a new type, type Auth. An Auth type must return a token and can optionally include any other user data. Update the 2 mutations to return the auth object instead of user.
Mpre mutations added
Note that addReaction() will return the parent Thought instead of the newly created Reaction. This is because the front end will ultimately track changes on the thought level, not the reaction level.
*/

// export the typeDefs
module.exports = typeDefs;
