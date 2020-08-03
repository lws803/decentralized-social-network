import React from "react";

import { action } from "@storybook/addon-actions";
import Card from "../articles/ProfileCard";

import profileImage from "../res/7874219.jpeg";

export default {
  title: "Article Profile Card",
  component: Card,
};

export const Default = () => (
  <Card
    authorPhoto={profileImage}
    onFollowClick={action("follow")}
    dateCreated="3 Aug, 2020"
    authorName="lws803"
  />
);
