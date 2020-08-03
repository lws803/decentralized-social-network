import React from "react";

import { action } from "@storybook/addon-actions";
import Pod from "../articles/Pod";

import SanFran from "../res/sanfrancisco.jpg";

export default {
  title: "Article Pod",
  component: Pod,
};

// TODO: Look for the first image in the rich text
// and the first chunk of text ot be a description

export const Default = () => (
  <Pod
    coverPhoto={SanFran}
    title="Hello penyet"
    body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
    tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed 
    augue lacus. Quam nulla porttitor massa id neque aliquam. Ultrices mi tempus imperdiet 
    nulla malesuada. Eros in cursus turpis massa tincidunt dui ut ornare lectus. 
    Egestas sed sed risus pretium. Lorem dolor sed viverra ipsum. 
    Gravida rutrum quisque non tellus…
    "
    author="lws803"
    time="3 Aug, 2020"
  />
);
