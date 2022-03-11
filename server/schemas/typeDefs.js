/* import graphQL / gql tagged template function from apollo-server-express. Tagged templates are an advanced use of template literals (ES6)*/
const { gql } = require("apollo-server-express");

// create our typeDefs
const typeDefs = gql`
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
    thoughts(username: String): [Thought]
  }
`;
/*we're instructing our query that we'll return an array, as noted by the [] square brackets around the returning data, [Thought]. With this custom data type, we are able to instruct the thoughts query so that each thought that returns can include _id, thoughtText, username, and reactionCount fields with their respective GraphQL scalars. The new ones here, ID and Int, are indeed new to us. ID is essentially the same as String except that it is looking for a unique identifier; and Int is simply an integer.
 */

// export the typeDefs
module.exports = typeDefs;
