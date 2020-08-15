import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import axios from "axios";

import history from "../utils/History";
import { PageContainer, EditButton } from "../common/CommonStyles";
import LazyImage from "../common/LazyImage";

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      bioContent: "",
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

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    this.uploadPhoto(file)
      .then(url => {
        this.setState({ profilePhoto: url });
      })
      .catch(err => alert(err));
  }

  render() {
    return (
      <PageContainer>
        <ProfileImageContainer>
          <input
            id="myInput"
            type="file"
            ref={ref => (this.upload = ref)}
            style={{ display: "none" }}
            onChange={this.onChangeFile.bind(this)}
          />
          <LazyImage
            src={this.state.profilePhoto}
            width={100}
            height={100}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "grey",
            }}
            onClick={() => this.upload.click()}
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
          <textarea
            style={{ width: "100%", padding: "5px" }}
            rows="10"
            cols="30"
            onChange={e => {
              if (e.target.value.length < 200)
                this.setState({ bioContent: e.target.value || "" });
            }}
            value={this.state.bioContent}
          />
        </BioEditor>
        <CharacterCount>
          Characters left: {200 - this.state.bioContent.length}
        </CharacterCount>
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

const CharacterCount = styled.div`
  margin-top: 10px;
  margin-right: auto;
  margin-left: auto;
`;

export default withRouter(ProfileEdit);
