import React from "react";

import Gun from "gun/gun";
import styled from "styled-components";

import AuthenticationModal from "./authModal/AuthenticationModal";
import ProfileImage from "./profile/ProfileImage";
import LightCKEditor from "./common/LightCKEditor";

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      content: undefined,
      bioCharacters: undefined,
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
            // TODO: Now we upload this file
          />
        </ProfileImageContainer>
        <div
          style={{ marginTop: "20px", fontSize: "large", textAlign: "center" }}
        >
          {this.state.user}
        </div>
        <BioEditor>
          <LightCKEditor
            onInit={editor => {
              const wordCountPlugin = editor.plugins.get("WordCount");
              wordCountPlugin.on("update", (evt, data) => {
                this.setState({
                  bioCharacters: data.characters,
                });
              });
            }}
            onChange={(event, editor) => {
              this.setState({ content: editor.getData() });
            }}
            data={this.state.content}
          />
        </BioEditor>
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

const BioEditor = styled.div`
  margin-top: 20px;
`;

export default ProfileEdit;
// TODO: Consider creating an edit page to allow editing to bio
