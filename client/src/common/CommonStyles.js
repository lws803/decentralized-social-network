import React from "react";

import { Button } from "semantic-ui-react";
import styled from "styled-components";

export const PageContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  font-family: Georgia;
`;

export const ArticleBox = styled.div`
  font-size: 15px;
  font-family: Georgia;
`;

export const EditButton = props => {
  return (
    <Button {...props} size="tiny" color="blue">
      {props.children}
    </Button>
  );
};

export const DeleteButton = props => (
  <Button {...props} size="tiny" negative>
    {props.children}
  </Button>
);
