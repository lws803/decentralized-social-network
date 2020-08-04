import React from "react";

import { action } from "@storybook/addon-actions";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

export const NewEditor = () => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data="<p>Hello from CKEditor 5!</p>"
      onInit={editor => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
  );
};
