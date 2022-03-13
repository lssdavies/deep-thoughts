//importing models
const { User, Thought } = require("../models");
// importing GraphQL error handling for when a user tries to log in with the wrong username or password.
const { AuthenticationError } = require("apollo-server-express");
//importing the signToken function
const { signToken } = require("../utils/auth");

/*Here, we pass in the parent as more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument from the second parameter. We use a ternary (?) operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object. We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought. Querying thoughts will return all thoughts because of find() and they will be sorted in decending order sort({createAt: -1}).*/
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("thoughts")
        .populate("friends");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },

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
  },
  /**Both user queries omit the Mongoose-specific __v property and the user's password information, which doesn't ever have to return anyway. We also populate the fields for friends and thoughts, so we can get any associated data in return */

  // Mutations
  Mutation: {
    /* add user the Mongoose User model creates a new user in the database with whatever is passed in as the args. Updates the two mutation resolvers to sign a token and return an object that combines the token with the user's data.*/
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          //the { new: true } flag in User.findByIdAndUpdate() returns the updated document
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $push: {
              reactions: { reactionBody, username: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError("You need to be logged in!");
      /**Reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator. Because you're updating an existing thought, the client will need to provide the corresponding thoughtId.  */
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate("friends");

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
      /**This mutation will look for an incoming friendId and add that to the current user's friends array. A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent duplicate entries. */
    },
  },
};

/**Only logged-in users should be able to use addThought and addReaction mutation, hence why we check for the existence of context.user first. Remember, the decoded JWT is only added to context if the verification passes. The token includes the user's username, email, and _id properties, which become properties of context.user and can be used in the follow-up Thought.create() and User.findByIdAndUpdate() methods. */

module.exports = resolvers;

/**Pro Tip
 Notice that the error message doesn't specify whether the email or password is incorrect. If a malicious user is trying to hack into someone's account, for example, you won't want to confirm that they've guessed the email address correctly and only need to focus on the password now. */
