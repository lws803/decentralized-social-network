import React from "react";
import profileImage from "../res/7874219.jpeg";

import { action } from "@storybook/addon-actions";
import ProfileImage from "../profile/ProfileImage";

export default {
  title: "Profile Image",
  component: ProfileImage,
};

export const Default = () => <ProfileImage onImageSelect={action("file selected")}/>;

export const WithImage = () => <ProfileImage image={profileImage}/>;
