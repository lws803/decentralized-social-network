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
          // TODO: Add IPFS to to upload peacefully
          simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: "http://example.com",

            // Enable the XMLHttpRequest.withCredentials property.
            withCredentials: true,

            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
              "X-CSRF-TOKEN": "CSFR-Token",
              Authorization: "Bearer <JSON Web Token>",
            },
          },
        }}
      />
    );
  }
}

export default CustomCKEditor;
