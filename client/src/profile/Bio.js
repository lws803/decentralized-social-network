import React from "react";
import PropTypes from "prop-types";

import DOMPurify from "dompurify";
import styled from "styled-components";

class Bio extends React.Component {
  render() {
    // TODO: render a HTML bio but switch to the rich text editor when clicked
    // TODO: Convert the JSON string and then convert it to html before sanitizing and displaying it
    var thisIsMyCopy = "<p>copy copy copy <strong>strong copy</strong></p>";
    return (
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(thisIsMyCopy) }}
      ></div>
    );
  }
}

Bio.propTypes = {};

export default Bio;
