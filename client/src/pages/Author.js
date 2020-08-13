import React from "react";

import styled from "styled-components";
import { withRouter } from "react-router-dom";
import Gun from "gun/gun";

import history from "../utils/History";
import SmallPodsCollection from "../articles/SmallPodsCollection";
import { PageContainer } from "../common/CommonStyles";
import { LargeCard } from "../articles/ProfileCard";

class Author extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.state = {
      author: undefined,
      authorPhoto: undefined,
      authorBio: undefined,
    };
  }

  componentDidMount() {
    this.getAuthorInfo();
  }

  getAuthorInfo() {
    const { user } = this.props.match.params;
    this.gun.get(user).once(user => {
      this.setState({
        author: user.alias,
        authorPhoto: user.photo,
        authorBio: user.bio,
      });
    });
  }

  render() {
    const { user } = this.props.match.params;

    return (
      <PageContainer>
        <LargeCardContainer>
          <LargeCard
            authorPhoto={this.state.authorPhoto}
            authorName={this.state.author}
            bio={this.state.authorBio}
            onProfileClick={() => history.push(`/profile/author/${user}`)}
          />
        </LargeCardContainer>
        <CollectionViewContainer>
          <SmallPodsCollection gunSession={this.gun} pubKey={user} />
        </CollectionViewContainer>
      </PageContainer>
    );
  }
}

const LargeCardContainer = styled.div`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;

const CollectionViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: center;
  width: 100%;
`;

export default withRouter(Author);
