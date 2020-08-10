import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";

import history from "../utils/History";
import Bio from "../profile/Bio";
import LazyImage from "../common/LazyImage";
import { PageContainer } from "../common/CommonStyles";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      bioContent: undefined,
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

  render() {
    return (
      <PageContainer>
        <ImageContainer>
          <LazyImage
            src={this.state.profilePhoto}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        </ImageContainer>
        <BioContainer>
          <Bio content={this.state.bioContent} />
        </BioContainer>
        <EditButton onClick={() => history.push("/profile/my_profile/edit")}>
          Edit
        </EditButton>
      </PageContainer>
    );
  }
}

const ImageContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;

const BioContainer = styled.div`
  margin-top: 20px;
  width: 694px;
  height: 167px;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  overflow: hidden;
`;

const EditButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`;

export default withRouter(Profile);
