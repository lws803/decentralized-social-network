import React from "react";

import { action } from "@storybook/addon-actions";
import { Image } from "semantic-ui-react";

import NavigationBar, { IconButton } from "../navBar/NavigationBar";
import ProfileDropdown from "../navBar/ProfileDropdown";
import PenyetLogo from "../res/penyet.png";

export default {
  title: "Navigation Bar",
  component: NavigationBar,
};

export const Default = () => {
  var mockUser = {
    is: false,
    auth: action("login"),
    create: action("signup"),
    leave: action("logout"),
    is: true,
  };
  return <NavigationBar user={mockUser} />;
};
