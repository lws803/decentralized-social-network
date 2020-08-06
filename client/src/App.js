import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Gun from "gun/gun";

import NavigationBar, { IconButton, MainLogo } from "./navBar/NavigationBar";
import PostArticle from "./articles/PostArticle";
import Main from "./Main";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.gunSession = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.user = this.gunSession.user().recall({ sessionStorage: true });
  }

  componentDidMount() {
    this.user.auth("lws803", "cool");
    if (this.user.is) {
      console.log("user logged in");
    } else {
      // TODO: Show the login modal here
      console.log("user not logged in");
    }
  }

  render() {
    return (
      <div>
        <Router>
          <NavigationBar
            mainLogoButton={
              <Link to="/">
                <MainLogo>Main Logo</MainLogo>
              </Link>
            }
            articleButton={
              <Link to="/new_article">
                <IconButton>New Story</IconButton>
              </Link>
            }
          />
          <Switch>
            <Route path="/new_article">
              <PostArticle />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
