import React from "react";

import { action } from "@storybook/addon-actions";
import Vote from "../articles/Vote";

export default {
  title: "Voting",
  component: Vote,
};

export const Default = () => (
  <Vote
    onClickUpVote={action("up vote")}
    onClickDownVote={action("down vote")}
    upVoteCount={100}
    downVoteCount={10000}
  />
);
