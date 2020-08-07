import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

class LightCKEditor extends React.Component {
  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        config={{
          removePlugins: [
            "Title",
            "FontSize",
            "Heading",
            "ImageUpload",
            "PasteFromOffice",
            "MediaEmbed",
            "Code",
            "CodeBlock",
          ],
          toolbar: {
            items: [
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "underline",
              "undo",
              "redo",
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
            uploadUrl: process.env.REACT_APP_API_URL,
            withCredentials: false,
          },
        }}
        {...this.props}
      />
    );
  }
}

export default LightCKEditor;
