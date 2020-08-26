/** @jsx jsx */
import SyntaxHighlighter from "react-syntax-highlighter";
import monokai from "react-syntax-highlighter/dist/esm/styles/hljs/monokai";
import ReactPlayer from "react-player";
import { css, jsx } from "@emotion/core";

const transform = (node, children) => {
  // Embed code blocks
  if (node.tagName === "PRE" && children.length) {
    if (children[0].props.tagName === "code") {
      return (
        <SyntaxHighlighter
          language={node.getAttribute("language")}
          showLineNumbers
          style={monokai}
        >
          {children[0].props.children}
        </SyntaxHighlighter>
      );
    }
  }
  // Embed players
  if (node.tagName === "FIGURE" && node.className === "media") {
    return (
      <ReactPlayer
        url={node.children[0].getAttribute("url")}
        controls
        css={css`
          margin: 1em auto;
          max-width: 100%;
          min-width: 50px;
        `}
      />
    );
  }
};

export { transform };
