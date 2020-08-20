import React from "react";
import PropTypes from "prop-types";

import LazyImage from "../common/LazyImage";

import Placeholder from "../res/profile_placeholder.png";

export default function ProfileImage(props) {
  if (props.profilePhoto) {
    return (
      <LazyImage
        src={props.profilePhoto}
        width={props.width}
        height={props.height}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }
  return (
    <img
      src={Placeholder}
      alt=""
      style={{
        height: `${props.height}px`,
        width: `${props.width}px`,
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  );
}

ProfileImage.propTypes = {
  profilePhoto: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
