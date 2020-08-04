import React from "react";
import PropTypes from "prop-types";

import DOMPurify from "dompurify";

class Bio extends React.Component {
  render() {
    return (
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(this.props.content || "") }}
      ></div>
    );
  }
}

Bio.propTypes = {
  content: PropTypes.string,
};

export default Bio;
