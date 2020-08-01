import React from "react";

import { action } from "@storybook/addon-actions";
import NavigationBar from "../navBar/NavigationBar";

export default {
  title: "NavigationBar",
  component: NavigationBar,
};

export const Default = () => (
  <NavigationBar
    onLogoClick={action("main logo")}
    onSearchClick={action("search")}
    onBookmarksClick={action("bookmarks")}
    onNewStoryClick={action("new story")}
    onProfileClick={action("profile")}
    onSettingsClick={action("settings")}
    onFollowingClick={action("following")}
  />
);
