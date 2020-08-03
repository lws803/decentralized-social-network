import React from "react";
import PropTypes from "prop-types";

import DOMPurify from "dompurify";
import draftToHtml from "draftjs-to-html";

class Bio extends React.Component {
  render() {
    var exstingContent = ""
    if (this.props.content) {
      exstingContent = draftToHtml(JSON.parse(this.props.content));
    }
    return (
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exstingContent) }}
      ></div>
    );
  }
}

Bio.propTypes = {
  content: PropTypes.string,
};

export default Bio;
