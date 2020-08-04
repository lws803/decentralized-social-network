import React from "react";

import Bio from "../profile/Bio";

export default {
  title: "Profile Bio",
  component: Bio,
};

export const Default = () => (
  <Bio content={"<h1>My name is lws803</h1><p>Hello world</p>"} />
);
