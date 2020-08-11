import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import { Segment } from "semantic-ui-react";

import history from "../utils/History";
import LazyImage from "../common/LazyImage";
import { PageContainer, EditButton } from "../common/CommonStyles";

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
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </ImageContainer>
        <div
          style={{
            marginTop: "20px",
            fontSize: "large",
            textAlign: "center",
          }}
        >
          {this.state.user}
        </div>
        <BioContainer>
          <Segment style={{height: "100%"}}>{this.state.bioContent}</Segment>
        </BioContainer>
        <ToolsContainer>
          <EditButton onClick={() => history.push("/profile/my_profile/edit")}>
            Edit
          </EditButton>
        </ToolsContainer>
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
  width: 60%;
  height: 200px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
`;

const ToolsContainer = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
`;

export default withRouter(Profile);
