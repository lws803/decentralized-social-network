import React from "react";

import styled from "styled-components";
import Dropzone from "react-dropzone";

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: undefined,
    };
  }

  render() {
    return (
      <Container>
        <Dropzone
          onDrop={acceptedFiles => {
            this.setState({
              imageFile: acceptedFiles ? acceptedFiles[0] : undefined,
            });
            // TODO: Change image once drag and dropped
            // TODO: Also add a max size and file type validation
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
                <MiddleSection>
                  {/* {this.state.imageFile && <img src={this.state.imageFile} />} */}
                  {/* FIXME: Display the png file properly */}
                </MiddleSection>
                <input {...getInputProps()} />
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
  border-radius: 50%;
`;

const MiddleSection = styled.div`
  position: relative;
  margin: auto;
`;

const StyledSection = styled.section`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export default ProfileImage;
