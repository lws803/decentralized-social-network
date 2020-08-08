import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Gun from "gun/gun";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import NavigationBar, { IconButton, MainLogo } from "./navBar/NavigationBar";
import PostArticle from "./pages/PostArticle";
import Article from "./pages/Article";
import Main from "./pages/Main";
import ProfileEdit from "./pages/ProfileEdit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  var gunSession = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
  var user = gunSession.user().recall({ sessionStorage: true });
  if (user.is) {
    console.log("user logged in");
  } else {
    console.log("user not logged in");
  }
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
            <Link to="/article/new">
              <IconButton>New Story</IconButton>
            </Link>
          }
          profileDropdown={
            <Dropdown text="Profile">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/profile/my_profile">My Profile</Link>
                </Dropdown.Item>
                {/* <Dropdown.Item text="Following" onClick={() => {}} /> */}
                <Dropdown.Item text="Settings" onClick={() => {}} />
              </Dropdown.Menu>
            </Dropdown>
          }
        />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/article/new" component={PostArticle} />
          <Route
            exact
            path="/article/:user/:path/:articleID/edit"
            component={PostArticle}
          />
          <Route
            exact
            path="/article/:user/:path/:articleID"
            component={Article}
          />
          <Route exact path="/profile/my_profile" component={Profile} />
          <Route
            exact
            path="/profile/my_profile/edit"
            component={ProfileEdit}
          />
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}
