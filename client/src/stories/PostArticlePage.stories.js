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

export const NewArticle = () => <PostArticle />;

export const EditArticle = () => (
  <PostArticle
    uuid={"fake-uuid"}
    content={
      "<p>Hello penyet, have some cat</p>\
      <img src='https://ipfs.io/ipfs/QmTNRkX4ZnZ1JoDwnLtWsGRWN5K22X5wf1dNg93htF4Jj8'/>"
    }
    tags={["hello", "cat"]}
    createdAt=""
  />
);
