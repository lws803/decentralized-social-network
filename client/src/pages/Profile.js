import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import styled from "styled-components";
import { Segment } from "semantic-ui-react";

import history from "../utils/History";
import LazyImage from "../common/LazyImage";
import { PageContainer, EditButton } from "../common/CommonStyles";
import Placeholder from "../res/placeholder.png";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun(
      JSON.parse(sessionStorage.getItem("currentPeers")).items
    );
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      user: undefined,
      bioContent: undefined,
      profilePhoto: undefined,
    };
  }

  componentDidMount() {
    if (this.user.is)
      this.user.once(user => {
        this.setState({
          profilePhoto: user.photo,
          bioContent: user.bio,
          user: user.alias,
        });
      });
  }

  render() {
    const RenderProfileImage = props => {
      if (props.profilePhoto) {
        return (
          <LazyImage
            src={props.profilePhoto}
            width={100}
            height={100}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        );
      }
      return <img src={Placeholder} />;
    };
    return (
      <PageContainer>
        <ImageContainer>
          <RenderProfileImage profilePhoto={this.state.profilePhoto} />
        </ImageContainer>
        <UserName
          onClick={() => history.push(`/profile/author/~${this.user.is.pub}`)}
        >
          {this.state.user}
        </UserName>
        <BioContainer>
          <Segment style={{ height: "100%" }}>{this.state.bioContent}</Segment>
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
  border-radius: 50%;
  width: 100px;
  height: 100px;
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

const UserName = styled.div`
  margin-top: 20px;
  font-size: large;
  text-align: center;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default withRouter(Profile);
