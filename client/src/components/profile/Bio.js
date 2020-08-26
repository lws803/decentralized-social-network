import React from "react";
import PropTypes from "prop-types";

const Bio = props => {
  return <div> {props.content}</div>;
};

Bio.propTypes = {
  content: PropTypes.string,
};

export default Bio;
