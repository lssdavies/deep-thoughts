/*run the npm install jsonwebtoken command to add the JWT package to your project.*/
const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
//token expiration
const expiration = "2h";

//this is imported to resolvers.js
module.exports = {
  // this middleware
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // return updated request object
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

/**The signToken() function expects a user object and will add that user's username, email, and _id properties to the token. Tokens are given an expiration date and a secret to sign the token with. Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token. */
/**Pro Tip
 * If your JWT secret is ever compromised, you'll need to generate a new one, immediately invalidating all current tokens. Because the secret is so important, you should store it somewhere other than in a JavaScript file—like an environment variable.
 */
