import React from "react";

import { action } from "@storybook/addon-actions";
import Bio from "../profile/Bio";

export default {
  title: "Profile Bio",
  component: Bio,
};

export const Default = () => (
  <Bio
    content={
      '{"blocks":[{"key":"fkoe9","text":"hello world","type":"header-two",\
  "depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
    }
  />
);
