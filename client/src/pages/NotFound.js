/** @jsx jsx */

import styled from "styled-components";
import ReactFitText from "react-fittext";
import { Image } from "semantic-ui-react";
import { css, jsx } from "@emotion/core";

import { PageContainer } from "../common/CommonStyles";
import NotFoundImage from "../res/not_found.png";

const NotFound = () => {
  return (
    <PageContainer>
      <ReactFitText
        compressor={2.5}
        css={css`
          width: 100%;
        `}
        maxFontSize={40}
        minFontSize={25}
      >
        <NotFoundTitle>Not Found</NotFoundTitle>
      </ReactFitText>
      <ImageContainer>
        <Image src={NotFoundImage} fluid />
      </ImageContainer>
    </PageContainer>
  );
};

const NotFoundTitle = styled.div`
  margin-top: 40px;
  text-align: center;
  font-family: Georgia;
`;

const ImageContainer = styled.div`
  width: 60%;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
`;

export default NotFound;
