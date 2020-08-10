import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Gun from "gun/gun";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import history from "./utils/History";
import NavigationBar, { IconButton, MainLogo } from "./navBar/NavigationBar";
import PostArticle from "./pages/PostArticle";
import Article from "./pages/Article";
import Main from "./pages/Main";
import ProfileEdit from "./pages/ProfileEdit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { PageContainer } from "./common/CommonStyles";
import AuthenticationModal from "./authModal/AuthenticationModal";

export default function App() {
  var gunSession = new Gun([sessionStorage.getItem("currentPeer")]);
  console.log("currently set peer:", sessionStorage.getItem("currentPeer"));
  var user = gunSession.user().recall({ sessionStorage: true });
  if (user.is) {
    console.log("user logged in");
  } else {
    console.log("user not logged in");
  }
  return (
    <div>
      <Router history={history}>
        <PageContainer>
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
                  <Dropdown.Item
                    text="My Profile"
                    onClick={() => history.push("/profile/my_profile")}
                  />
                  {/* <Dropdown.Item text="Following" onClick={() => {}} /> */}
                  {user.is && (
                    <Dropdown.Item
                      text="Logout"
                      onClick={() => {
                        user.leave();
                        window.location.reload(false);
                      }}
                    />
                  )}
                </Dropdown.Menu>
              </Dropdown>
            }
          />
        </PageContainer>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/article/new">
            <PostArticle />
            <AuthenticationModal
              user={user}
              reload={() => window.location.reload(false)}
            />
          </Route>
          <Route exact path="/article/:user/:path/:articleID/edit">
            <AuthenticationModal
              user={user}
              reload={() => window.location.reload(false)}
            />
            <PostArticle />
          </Route>
          <Route
            exact
            path="/article/:user/:path/:articleID"
            component={Article}
          />
          <Route exact path="/profile/my_profile">
            <AuthenticationModal
              user={user}
              reload={() => window.location.reload(false)}
            />
            <Profile />
          </Route>
          <Route exact path="/profile/my_profile/edit">
            <AuthenticationModal
              user={user}
              reload={() => window.location.reload(false)}
            />
            <ProfileEdit />
          </Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}
