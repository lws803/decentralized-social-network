import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

import { ArticleBox } from "../common/CommonStyles";
import {ChangeFontForAllHeadings} from "./CKPlugins";

class ReadOnlyEditor extends React.Component {
  render() {
    return (
      <ArticleBox>
        <CKEditor
          editor={ClassicEditor}
          onInit={editor => {
            editor.isReadOnly = true;
          }}
          config={{
            extraPlugins: [ChangeFontForAllHeadings],
            removePlugins: ["Title"],
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

export default ReadOnlyEditor;
