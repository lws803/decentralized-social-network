import React from "react";

import styled from "styled-components";
import Dropzone from "react-dropzone";

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  render() {
    return (
      <Container>
        <Dropzone
          onDrop={acceptedFiles => {
            this.setState({ files: acceptedFiles });
          }}
        >
          {({
            getRootProps,
            getInputProps,
            isDragAccept,
            isDragActive,
            isDragReject,
          }) => (
            <StyledSection>
              <DragDropContainer
                {...getRootProps(isDragActive, isDragAccept, isDragReject)}
              >
                <input {...getInputProps()} />
                <p>Profile</p>
              </DragDropContainer>
            </StyledSection>
          )}
        </Dropzone>
      </Container>
    );
  }
}

const getColor = props => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  width: 100px;
  height: 100px;
`;

const DragDropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  height: 100%;
  width: 100%;
`;

const StyledSection = styled.section`
  width: 100%;
  height: 100%;
`

export default ProfileImage;
