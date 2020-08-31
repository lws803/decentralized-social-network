/** @jsx jsx */

import styled from "styled-components";
import { css, jsx } from "@emotion/core";
import PropTypes from "prop-types";

import LazyImage from "../common/LazyImage";

const SmallPod = props => {
  return (
    <PodContainer
      onClick={props.onClick}
      css={css`
        width: ${props.size.width}px;
      `}
      isLoaded
    >
      {props.coverPhoto && (
        <LazyImage
          src={props.coverPhoto}
          css={css`
            object-fit: cover;
            width: 100%;
          `}
        />
      )}
      <Title>{props.title}</Title>
    </PodContainer>
  );
};

SmallPod.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.object,
  coverPhoto: PropTypes.string,
};

const Title = styled.div`
  font-weight: heavy;
  font-size: 20px;
  margin-top: 10px;
  font-family: Georgia;
  word-wrap: break-word;
  line-height: 1.35em;
  padding: 5px;
`;

const PodContainer = styled.div`
  @keyframes slowlyAppear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  margin: 10px;
  border: solid;
  height: auto;
  display: inline-block;
  cursor: pointer;
  animation: 0.25s ease-in-out 0s 1 slowlyAppear;
`;

export default SmallPod;
