import React from "react";

import { Router } from "react-router-dom";
import { action } from "@storybook/addon-actions";

import NavigationBar from "../components/navBar/NavigationBar";
import history from "../utils/History";
import { PageContainer } from "../components/common/CommonStyles";

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
  return (
    <Router history={history}>
      <PageContainer>
        <NavigationBar user={mockUser} />
      </PageContainer>
    </Router>
  );
};
