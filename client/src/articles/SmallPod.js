import React from "react";

import styled from "styled-components";

export default function SmallPod(props) {
  return (
    <PodContainer
      onClick={props.onClick}
      style={{
        width: `${props.size.width}px`,
      }}
      isLoaded
    >
      {props.coverPhoto && <CoverPhoto src={props.coverPhoto} />}
      <Title>{props.title}</Title>
    </PodContainer>
  );
}

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

  border: solid;
  height: auto;
  display: inline-block;
  cursor: pointer;
  animation: 0.25s ease-in-out 0s 1 slowlyAppear;
`;

const CoverPhoto = styled.img`
  object-fit: cover;
  width: 100%;
`;
