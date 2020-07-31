import React from "react";

import { action } from "@storybook/addon-actions";
import AuthenticationModal from "../authModal/AuthenticationModal";

export default {
  title: "AuthenticationModal",
  component: AuthenticationModal,
};

export const Default = () => <AuthenticationModal />;
