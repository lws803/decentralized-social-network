import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import axios from "axios";

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
      bioContent: undefined,
      bioCharacters: undefined,
      profilePhoto: undefined,
    };
  }

  componentDidMount() {
    this.user.get("alias").once(alias => {
      this.setState({ user: alias });
    });
    this.user.get("photo").once(url => this.setState({ profilePhoto: url }));
    this.user.get("bio").once(bio => this.setState({ bioContent: bio }));
  }

  async updateProfile() {
    if (this.state.bioCharacters > 100)
      throw new Error("Bio must be kept within the 100 character limit.");
    await this.user.get("photo").put(this.state.profilePhoto);
    await this.user.get("bio").put(this.state.bioContent);
  }

  async uploadPhoto(imageFile) {
    const formData = new FormData();
    formData.append("upload", imageFile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let res = await axios.post(
      process.env.REACT_APP_API_URL + "/image_upload",
      formData,
      config
    );
    return res.data.url;
  }

  render() {
    return (
      <Container>
        <AuthenticationModal user={this.user} />
        <ProfileImageContainer>
          <ProfileImage
            image={this.state.profilePhoto}
            onImageSelect={props => {
              this.uploadPhoto(props.imageFile)
                .then(url => {
                  this.setState({ profilePhoto: url });
                })
                .catch(err => alert(err));
            }}
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
              this.setState({ bioContent: editor.getData() });
            }}
            data={this.state.bioContent}
          />
        </BioEditor>
        <SaveButton
          onClick={() => {
            this.updateProfile()
              .then(ack => this.props.history.push("/profile/my_profile"))
              .catch(err => alert(err));
          }}
        >
          Save
        </SaveButton>
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

const SaveButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`;

export default withRouter(ProfileEdit);
