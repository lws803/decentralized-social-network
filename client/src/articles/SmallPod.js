import React from "react";

import styled from "styled-components";

export default function SmallPod(props) {
  return (
    <PodContainer
      style={{
        width: `${props.size.width}px`,
      }}
    >
      <CoverPhoto src={props.coverPhoto} />
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
  border: solid;
  height: auto;
  clear: both;
  display: inline-block;
`;

const CoverPhoto = styled.img`
  object-fit: cover;
  width: 100%;
`;
