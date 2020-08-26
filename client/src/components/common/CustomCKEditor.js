import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

import { ArticleBox } from "./CommonStyles";
import { ChangeFontForAllHeadings } from "./CKPlugins";

const CustomCKEditor = props => {
  return (
    <ArticleBox>
      <CKEditor
        editor={ClassicEditor}
        onInit={editor => {
          console.log("Editor is ready to use!", editor);
        }}
        config={{
          extraPlugins: [ChangeFontForAllHeadings],
          removePlugins: ["Title"],
          toolbar: {
            items: [
              "heading",
              "|",
              "fontSize",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "underline",
              "blockQuote",
              "undo",
              "redo",
              "|",
              "indent",
              "outdent",
              "|",
              "imageUpload",
              "code",
              "codeBlock",
              "mediaEmbed",
            ],
          },
          language: "en",
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:full",
              "imageStyle:side",
            ],
          },
          simpleUpload: {
            uploadUrl: sessionStorage.getItem("currentAPI") + "/image_upload",
            withCredentials: false,
          },
        }}
        {...props}
      />
    </ArticleBox>
  );
};

export default CustomCKEditor;
