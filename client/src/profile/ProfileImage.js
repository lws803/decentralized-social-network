/** @jsx jsx */

import PropTypes from "prop-types";
import { jsx, css } from "@emotion/core";

import LazyImage from "../common/LazyImage";

import Placeholder from "../res/profile_placeholder.png";

const ProfileImage = props => {
  if (props.profilePhoto) {
    return (
      <LazyImage
        src={props.profilePhoto}
        width={props.width}
        height={props.height}
        css={css`
          border-radius: 50%;
          object-fit: cover;
        `}
      />
    );
  }
  return (
    <img
      src={Placeholder}
      alt=""
      css={css`
        height: ${props.height}px;
        width: ${props.width}px;
        object-fit: cover;
        border-radius: 50%;
      `}
    />
  );
};

ProfileImage.propTypes = {
  profilePhoto: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ProfileImage;
