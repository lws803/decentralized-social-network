import React from "react";

import { action } from "@storybook/addon-actions";
import NavigationBar, { IconButton, MainLogo } from "../navBar/NavigationBar";

import ProfileDropdown from "../navBar/ProfileDropdown";

export default {
  title: "Navigation Bar",
  component: NavigationBar,
};

export const Default = () => (
  <NavigationBar
    mainLogoButton={<MainLogo onClick={action("main")}>Main Logo</MainLogo>}
    onSearchClick={action("search")}
    onBookmarksClick={action("bookmarks")}
    articleButton={
      <IconButton onClick={action("new story")}>New Story</IconButton>
    }
    profileDropdown={<ProfileDropdown/>}
  />
);
