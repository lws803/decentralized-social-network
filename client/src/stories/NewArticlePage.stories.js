import React from "react";

import { action } from "@storybook/addon-actions";

import NewArticle from "../articles/NewArticle";

export default {
  title: "New Article Page",
  component: NewArticle,
};

export const Default = () => <NewArticle />;
