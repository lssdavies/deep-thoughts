import React from "react";

/**importing the useQuery Hook from Apollo Client. Allows us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js earlier. We also imported the QUERY_THOUGHTS.*/
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS } from "../utils/queries";
//importing thoughtList component to hompage
import ThoughtList from "../components/ThoughtList";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  /**Next we'll get the thought data out of the query's response, because every GraphQL response comes in a big data object. In this case, we'll need to access data.thoughts.
   * What's this weird syntax?This is called optional chaining */

  /*if data exists, store it in the thoughts constant or If data is undefined, then save it to an empty array*/
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  /** With this, we use a ternary operator to conditionally render the <ThoughtList> component. If the query hasn't completed and loading is still defined, we display a message to indicate just that. Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props. */
  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

/** When we load the Home component in the application, we'll execute the query for the thought data. Because this is asynchronous, just like using fetch(), Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet. When it's finished and we have data returned from the server, that information is stored in the destructured data property. Working with Promise-based functionality in React can get cumbersome. But with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.
 
Optional chaining negates the need to check if an object even exists before accessing its properties. In this case, no data will exist until the query to the server is finished. So if we type data.thoughts, we'll receive an error saying we can't access the property of data—because it is undefined.
*/
