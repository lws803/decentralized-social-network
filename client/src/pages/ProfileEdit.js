import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

import history from "../utils/History";
import { PageContainer, EditButton } from "../common/CommonStyles";
import Placeholder from "../res/profile_placeholder.png";
import { Errors } from "../common/Messages";

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun(
      JSON.parse(sessionStorage.getItem("currentPeers")).items
    );
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
      .catch(() => {
        alert(Errors.incorrect_image_file_upload);
      });
  }

  render() {
    return (
      <PageContainer>
        <ProfileImageContainer>
          <LazyLoadImage
            src={this.state.profilePhoto}
            placeholderSrc={Placeholder}
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
                this.setState({ bioContent: e.target.value });
            }}
            value={this.state.bioContent}
          />
        </BioEditor>
        <CharacterCount>
          Characters left:{" "}
          {this.state.bioContent ? 200 - this.state.bioContent.length : 200}
        </CharacterCount>
        <ButtonToolsContainer>
          <EditButton
            onClick={() => {
              this.updateProfile()
                .then(() => history.push("/profile/my_profile"))
                .catch(err => alert(err));
            }}
          >
            Save
          </EditButton>
        </ButtonToolsContainer>
        {/* Phantom input component */}
        <input
          id="myInput"
          type="file"
          ref={ref => (this.upload = ref)}
          style={{ display: "none" }}
          onChange={this.onChangeFile.bind(this)}
        />
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
