import React from "react";

import { action } from "@storybook/addon-actions";
import RichTextEditor from "../common/RichTextEditor";

export default {
  title: "RichTextEditor",
  component: RichTextEditor,
};

export const ArticleEditor = () => <RichTextEditor onSave={action("saved")} />;
