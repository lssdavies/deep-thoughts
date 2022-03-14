import React from "react";
//importing Links from react-router
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>
        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
/** JSX to conditionally return different navigation items depending on the outcome of the Auth.loggedIn(). If it returns true, and we're logged in, we want to display navigation items tailored to the user. If it returns false, we'll display the default items for logging in and signing up.*/

/** Navigation links with react cant use <a> elements. An element like <a href="/login"> would cause the browser to refresh and make a new request to your server for /login. That would defeat the whole purpose of React and its single-page goodness. Instead, you can use React Router's Link component. This component will change the URL while staying on the same page.*/
