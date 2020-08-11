import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import axios from "axios";

import history from "../utils/History";
import ProfileImage from "../profile/ProfileImage";
import LightCKEditor from "../common/LightCKEditor";
import { Errors } from "../common/Messages";
import { PageContainer, EditButton } from "../common/CommonStyles";

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      bioContent: undefined,
      bioCharacters: undefined,
      profilePhoto: undefined,
    };
  }

  componentDidMount() {
    if (this.user.is)
      this.user.once(user =>
        this.setState({
          profilePhoto: user.photo,
          bioContent: user.bio,
          user: user.alias,
        })
      );
  }

  async updateProfile() {
    if (this.state.bioCharacters > 100)
      throw new Error(Errors.bio_character_limit);
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
      sessionStorage.getItem("currentAPI") + "/image_upload",
      formData,
      config
    );
    return res.data.url;
  }

  render() {
    return (
      <PageContainer>
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
          style={{
            marginTop: "20px",
            fontSize: "large",
            textAlign: "center",
          }}
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
        <ButtonToolsContainer>
          <EditButton
            onClick={() => {
              this.updateProfile()
                .then(ack => history.push("/profile/my_profile"))
                .catch(err => alert(err));
            }}
          >
            Save
          </EditButton>
        </ButtonToolsContainer>
      </PageContainer>
    );
  }
}

const ProfileImageContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  width: 100px;
  height: 100px;
`;

const BioEditor = styled.div`
  margin-top: 20px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonToolsContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`;

export default withRouter(ProfileEdit);
