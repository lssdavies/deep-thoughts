import React from "react";

/**importing the useQuery Hook from Apollo Client. Allows us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js earlier. We also imported the QUERY_THOUGHTS.*/
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
//importing thoughtList component to hompage
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import Auth from "../utils/auth";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  /**Next we'll get the thought data out of the query's response, because every GraphQL response comes in a big data object. In this case, we'll need to access data.thoughts.
   * What's this weird syntax?This is called optional chaining */

  /*if data exists, store it in the thoughts constant or If data is undefined, then save it to an empty array*/
  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  const loggedIn = Auth.loggedIn();

  /** With this, we use a ternary operator to conditionally render the <ThoughtList> component. If the query hasn't completed and loading is still defined, we display a message to indicate just that. Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props. */
  return (
    /** we're conditionally defining the layout for this <div className={`col-12 mb-3>. If the user isn't logged in, it'll span the full width of the row. But if you the user is logged in, it'll only span eight columns, leaving space for a four-column <div> on the righthand side.*/
    <main>
      <div className="flex-row justify-space-between">
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
/** if the value of loggedIn is true (line 40)and there is data in the userData variable we created from the useQuery() Hook, we'll render a righthand column <div> that holds our <FriendList> component!*/


/** When we load the Home component in the application, we'll execute the query for the thought data. Because this is asynchronous, just like using fetch(), Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet. When it's finished and we have data returned from the server, that information is stored in the destructured data property. Working with Promise-based functionality in React can get cumbersome. But with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.
 
Optional chaining negates the need to check if an object even exists before accessing its properties. In this case, no data will exist until the query to the server is finished. So if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
*/
