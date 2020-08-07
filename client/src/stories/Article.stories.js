import React from "react";

import { action } from "@storybook/addon-actions";

import Article from "../articles/Article";

export default {
  title: "Article",
  component: Article,
};

export const Default = () => <Article />;
