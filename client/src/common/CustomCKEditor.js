import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

import { ArticleBox } from "./CommonStyles";
import {ChangeFontForAllHeadings} from "./CKPlugins";

class CustomCKEditor extends React.Component {
  render() {
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
              uploadUrl: process.env.REACT_APP_API_URL + "/image_upload",
              withCredentials: false,
            },
          }}
          {...this.props}
        />
      </ArticleBox>
    );
  }
}

export default CustomCKEditor;
