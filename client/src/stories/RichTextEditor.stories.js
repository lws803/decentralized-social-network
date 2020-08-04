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

export const Default = () => <RichTextEditor onSave={action("save")} />;

export const WithContent = () => (
  <RichTextEditor onSave={action("save")} initial={initial} />
);

export const CKEditor = () => {
  return <CustomCKEditor />;
};
