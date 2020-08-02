import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Dropzone from "react-dropzone";

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Dropzone
          onDrop={acceptedFiles => {
            this.props.onImageSelect({
              imageFile: acceptedFiles ? acceptedFiles[0] : undefined,
            });
          }}
        >
          {({
            getRootProps,
            getInputProps,
            isDragAccept,
            isDragActive,
            isDragReject,
          }) => (
            <section
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <DragDropContainer
                {...getRootProps(isDragActive, isDragAccept, isDragReject)}
                style={{
                  backgroundImage: `url(${this.props.image})`,
                  backgroundSize: "cover",
                }}
              >
                <input {...getInputProps()} />
              </DragDropContainer>
            </section>
          )}
        </Dropzone>
      </Container>
    );
  }
}

ProfileImage.propTypes = {
  onImageSelect: PropTypes.func,
  image: PropTypes.any,
};

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
  position: absolute;
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
  overflow: hidden;
  position: relative;
`;

const ImageDiv = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default ProfileImage;
