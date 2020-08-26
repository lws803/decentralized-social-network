/** @jsx jsx */

import styled from "styled-components";
import ReactFitText from "react-fittext";
import { Image } from "semantic-ui-react";
import { css, jsx } from "@emotion/core";

import { PageContainer } from "../common/CommonStyles";
import PenyetImage from "../../res/penyet.png";

const Main = () => {
  return (
    <PageContainer>
      <LogoContainer>
        <Image src={PenyetImage} fluid />
      </LogoContainer>
      <ReactFitText
        compressor={6}
        minFontSize={15}
        css={css`
          width: 100%;
        `}
      >
        <TaglineContainer>Inclusivity and openness</TaglineContainer>
      </ReactFitText>
    </PageContainer>
  );
};

const LogoContainer = styled.div`
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
`;

const TaglineContainer = styled.div`
  margin-top: 5px;
  font-family: Georgia;
  text-align: center;
`;

export default Main;
