import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-for-code-and-image/build/ckeditor";

class CustomCKEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        onInit={editor => {
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
          licenseKey: "",
        }}
      />
    );
  }
}

export default CustomCKEditor;
