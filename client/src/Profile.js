import React from "react";

import Gun from "gun/gun";
import styled from "styled-components";

import AuthenticationModal from "./authModal/AuthenticationModal";
import ProfileImage from "./profile/ProfileImage";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    this.user.get("alias").once(alias => {
      this.setState({ user: alias });
    });
  }

  render() {
    return (
      <Container>
        <AuthenticationModal user={this.user} />
        <ProfileImageContainer>
          <ProfileImage
            image={
              "http://ipfs.io/ipfs/QmV4FZ3icC2AeaMFtLQH3VjaxQJBgjdXFSQSKp4Hp77kzM"
            }
            onImageSelect={props => {
              console.log(props.imageFile);
            }}
            // Now we upload this file
          />
        </ProfileImageContainer>
        <div
          style={{ marginTop: "20px", fontSize: "large", textAlign: "center" }}
        >
          {this.state.user}
        </div>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileImageContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  width: 100px;
  height: 100px;
`;

export default Profile;
