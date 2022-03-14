import React from "react";
import { Link } from "react-router-dom";

const ThoughtList = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map((thought) => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{" "}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{" "}
                  {thought.reactionCount ? "see" : "start"} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;

/**Here we instruct that the ThoughtList component to receive two props: a title and the thoughts array. We destructure the argument data to avoid using props.title and props.thoughts throughout the JSX code. We conditionally render JSX by checking to see if there's even any data in the thoughts array first. If there's no data, then we return a message stating that. If there is data, then we return a list of thoughts using the .map() method. 

Notice how we also check to see the value of thought.reactionCount. We're conditionally displaying a message to contextualize what the call to action should be. If there are no reactions, the user will start the discussion by adding the first reaction. If there are reactions, the user will view or add their own reaction to an existing list.

In both instances, we've added an extra path to the end of the Link component. For example, /profile/${thought.username} would become /profile/Zoe66 for that particular user. Test this out by navigating to the homepage and clicking on a thought's author name or text content. Unfortunately, you'll see that the NoMatch component gets rendered instead of Profile or SingleThought.

Why is that? In App.js, we specified that the /profile route must be exactly /profile for the Profile component to render. Alas, /profile/Zoe66 or any /profile/${username} URL counts as a completely different route. Fortunately, React Router supports URL parameters. This is very similar to using parameters in Express.js on the back end.
*/
