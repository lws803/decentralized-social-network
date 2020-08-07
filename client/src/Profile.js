import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Bio from "./profile/Bio";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      bioContent: undefined,
      profilePhoto: undefined,
    };
  }

  componentDidMount() {
    this.user.once(user =>
      this.setState({
        profilePhoto: user.photo,
        bioContent: user.bio,
        user: user.alias,
      })
    );
  }

  render() {
    return (
      <Container>
        <ImageContainer>
          <LazyLoadImage
            src={this.state.profilePhoto}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        </ImageContainer>
        <BioContainer>
          <Bio content={this.state.bioContent} />
        </BioContainer>
        <EditButton
          onClick={() => this.props.history.push("/profile/my_profile/edit")}
        >
          Edit
        </EditButton>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;

const BioContainer = styled.div`
  margin-top: 20px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
`;

const EditButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`;

export default withRouter(Profile);
