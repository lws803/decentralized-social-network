import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import Gun from "gun/gun";

import history from "./utils/History";
import NavigationBar from "./components/navBar/NavigationBar";
import PostArticle from "./components/pages/PostArticle";
import Article from "./components/pages/Article";
import Main from "./components/pages/Main";
import ProfileEdit from "./components/pages/ProfileEdit";
import Profile from "./components/pages/Profile";
import NotFound from "./components/pages/NotFound";
import { PageContainer } from "./components/common/CommonStyles";
import AuthenticationModal from "./components/authModal/AuthenticationModal";
import Author from "./components/pages/Author";
import Settings from "./components/pages/Settings";
import { Errors } from "./components/common/Messages";

export default function App() {
  var peers = JSON.parse(sessionStorage.getItem("currentPeers")).items;
  if (!peers.length) alert(Errors.no_connection_to_gun_instance);
  var gunSession = new Gun(peers);
  console.log("currently set peers:", peers);
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
          <NavigationBar user={user} />
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
          <Route exact path="/profile/author/:user" component={Author} />
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
          <Route exact path="/profile/settings">
            <AuthenticationModal
              user={user}
              reload={() => window.location.reload(false)}
            />
            <Settings />
          </Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}
