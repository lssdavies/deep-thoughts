import decode from "jwt-decode";

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);

    window.location.assign("/");
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
    window.location.assign("/");
  }
}

export default new AuthService();

/** With this, we're creating a new JavaScript class called AuthService that we instantiate a new version of for every component that imports it. This isn't always necessary, but it does ensure we are using a new version of the functionality and takes some of the risk out of leaving remnant data hanging around.

To follow a paradigm closer to true OOP principles, we created a series of methods that try to do one thing and one thing only. If they need to do anything outside of that, we rely on another method to perform that action for us.

This way, if we call the .loggedIn() method from a component, we'll get a simple true or false in return, but the functionality itself will rely on other methods to get to that response. If we call .login(), we'll accept the token, set it to localStorage, and refresh the app.
*/
