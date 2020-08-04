import React from "react";

import { action } from "@storybook/addon-actions";

import CustomCKEditor from "../common/CustomCKEditor";
import RichTextEditor from "../common/RichTextEditor";

export default {
  title: "RichText Editor",
  component: RichTextEditor,
};

sessionStorage.setItem(
  "draftail:content",
  '{"blocks":[{"key":"fkoe9","text":"hello world","type":"header-two","depth":0,\
  "inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
);
const initial = JSON.parse(sessionStorage.getItem("draftail:content"));

export const Default = () => {
  return (
    <CustomCKEditor
      data="
      <p>Hello penyet, have some maggiemee</p>
      <img src='http://ipfs.io/ipfs/QmadQpErLiKb2b7ZYYwMq6JB3fcjHdTzW54gRiSCev6mG3'/>"
      onChange={action("onChange")}
    />
  );
};

export const Draftail = () => <RichTextEditor onSave={action("save")} />;

export const DraftailWithContent = () => (
  <RichTextEditor onSave={action("save")} initial={initial} />
);

