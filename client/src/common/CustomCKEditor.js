import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

class CustomCKEditor extends React.Component {
  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        onInit={editor => {
          console.log("Editor is ready to use!", editor);
        }}
        config={{
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
            uploadUrl: process.env.REACT_APP_API_URL,  // TODO: Make this dynamic in future
            withCredentials: false,
          },
        }}
        {...this.props}
      />
    );
  }
}

export default CustomCKEditor;
