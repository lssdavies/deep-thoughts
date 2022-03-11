//importing models
const { User, Thought } = require("../models");

const resolvers = {
  thoughts: async (parent, { username }) => {
    const params = username ? { username } : {};
    return Thought.find(params).sort({ createdAt: -1 });
  },
};

/*Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. We use a ternary (?) operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object. We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought. Querying thoughts will return all thoughts because of find() and they will be sorted in decending order sort({createAt: -1})*/

module.exports = resolvers;
