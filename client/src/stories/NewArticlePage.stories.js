import React from "react";

import Gun from "gun/gun";
import SEA from "gun/sea";
import { action } from "@storybook/addon-actions";

import NewArticle from "../articles/NewArticle";

export default {
  title: "New Article Page",
  component: NewArticle,
};

var gunSession = new Gun(["http://127.0.0.1:8765/gun"])
var user = gunSession.user();
user.auth("lws803", "cool");  // TODO: Await for the user to login before passing it thru

export const Default = () => (
  <NewArticle gunSession={gunSession} user={user}/>
);
