import React from "react";

import { action } from "@storybook/addon-actions";
import RichTextEditor from "../common/RichTextEditor";

export default {
  title: "RichText Editor",
  component: RichTextEditor,
};

const initial = JSON.parse(sessionStorage.getItem("draftail:content"));

export const ArticleEditor = () => (
  <RichTextEditor onSave={action("saved")} initial={initial} />
);
