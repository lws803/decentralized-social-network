import React from "react";

import Gun from "gun/gun";
import { action } from "@storybook/addon-actions";

import ModifyArticle from "../articles/ModifyArticle";

export default {
  title: "Modify Article Page",
  component: ModifyArticle,
};

var gunSession = new Gun([process.env.REACT_GUN_HOST_URL]);
var user = gunSession.user().recall({ sessionStorage: true });
user.auth("lws803", "cool"); // Test user

export const Default = () => <ModifyArticle gunSession={gunSession} user={user} />;
