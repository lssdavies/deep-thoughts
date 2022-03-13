//importing models
const { User, Thought } = require("../models");

/*Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. We use a ternary (?) operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object. We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought. Querying thoughts will return all thoughts because of find() and they will be sorted in decending order sort({createAt: -1}).*/
const resolvers = {
  //get all thoughts
  thoughts: async (parent, { username }) => {
    const params = username ? { username } : {};
    return Thought.find(params).sort({ createdAt: -1 });
  },
  //get thought by id
  /* We destructure the _id argument value and place it into our .findOne() method to look up a single thought by its _id. Same for user*/
  thought: async (parent, { _id }) => {
    return Thought.findOne({ _id });
  },
  // get all users
  users: async () => {
    return User.find()
      .select("-__v -password")
      .populate("friends")
      .populate("thoughts");
  },
  // get a user by username
  user: async (parent, { username }) => {
    return User.findOne({ username })
      .select("-__v -password")
      .populate("friends")
      .populate("thoughts");
  },
  /**Both user queries omit the Mongoose-specific __v property and the user's password information, which doesn't ever have to return anyway. We also populate the fields for friends and thoughts, so we can get any associated data in return */
};

module.exports = resolvers;
