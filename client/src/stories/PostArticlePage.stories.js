import React from "react";

import Gun from "gun/gun";
import { action } from "@storybook/addon-actions";

import PostArticle from "../articles/PostArticle";

export default {
  title: "Post Article Page",
  component: PostArticle,
};

var gunSession = new Gun([process.env.REACT_GUN_HOST_URL]);
var user = gunSession.user().recall({ sessionStorage: true });
user.auth("lws803", "cool"); // Test user

export const NewArticle = () => (
  <PostArticle gunSession={gunSession} user={user} />
);

export const EditArticle = () => (
  <PostArticle gunSession={gunSession} user={user} uuid={"test"} />
);
