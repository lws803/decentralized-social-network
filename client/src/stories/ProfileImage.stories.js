import React from "react";
import profileImage from "../res/7874219.jpeg";

import ProfileImage from "../profile/ProfileImage";

export default {
  title: "Profile Image",
  component: ProfileImage,
};

export const Default = () => <ProfileImage width={100} height={100} />;

export const WithImage = () => (
  <ProfileImage profilePhoto={profileImage} width={100} height={100} />
);
