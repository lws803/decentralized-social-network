import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

class ReadOnlyEditor extends React.Component {
  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        onInit={editor => {
          editor.isReadOnly = true;
        }}
        config={{
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
    );
  }
}

export default ReadOnlyEditor;
