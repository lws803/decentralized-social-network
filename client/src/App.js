import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavigationBar, { IconButton } from "./navBar/NavigationBar";
import PostArticle from "./articles/PostArticle";
import Main from "./Main";

function App() {
  return (
    <div>
      <Router>
        <NavigationBar
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

export default App;
