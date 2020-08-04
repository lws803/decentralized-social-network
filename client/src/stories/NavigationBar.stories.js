import React from "react";

import { action } from "@storybook/addon-actions";
import NavigationBar, { IconButton } from "../navBar/NavigationBar";

export default {
  title: "Navigation Bar",
  component: NavigationBar,
};

export const Default = () => (
  <NavigationBar
    onLogoClick={action("main logo")}
    onSearchClick={action("search")}
    onBookmarksClick={action("bookmarks")}
    storyButton={
      <IconButton onClick={action("new story")}>New Story</IconButton>
    }
    onProfileClick={action("profile")}
    onSettingsClick={action("settings")}
    onFollowingClick={action("following")}
  />
);
