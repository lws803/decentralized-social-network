import React from "react";

import { action } from "@storybook/addon-actions";
import { Image } from 'semantic-ui-react'

import NavigationBar, { IconButton, MainLogo } from "../navBar/NavigationBar";
import ProfileDropdown from "../navBar/ProfileDropdown";
import PenyetLogo from "../res/penyet.png";

export default {
  title: "Navigation Bar",
  component: NavigationBar,
};

export const Default = () => (
  <NavigationBar
    mainLogoButton={<Image src={PenyetLogo} size="tiny"/>}
    onSearchClick={action("search")}
    onBookmarksClick={action("bookmarks")}
    articleButton={
      <IconButton onClick={action("new story")}>New Story</IconButton>
    }
    profileDropdown={<ProfileDropdown/>}
  />
);
