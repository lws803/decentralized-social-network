import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import moment from "moment";

import { Card, LargeCard } from "../articles/ProfileCard";
// import Vote from "./Vote";
import ReadOnlyEditor from "../common/ReadOnlyEditor";
import { PageContainer } from "../common/CommonStyles";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      authorPhoto: undefined,
      authorBio: undefined,
      uuid: undefined,
      content: undefined,
      author: undefined,
      title: undefined,
      createdAt: undefined,
      tags: [],
      editAllowed: false,
    };
  }

  componentDidMount() {
    const { articleID, path, user } = this.props.match.params;
    this.getContent(articleID, path, user);
    this.getEditingStatus(user);
  }

  async getEditingStatus(authorPub) {
    if (this.user.is) {
      const pubKey = await this.user.get("pub").once();
      this.setState({ editAllowed: pubKey === authorPub.substring(1) });
    }
  }

  async getContent(articleID, path, user) {
    const article = await this.gun.get(user).get(path).get(articleID).once();
    if (article !== null) {
      this.setState({ ...article, tags: JSON.parse(article.tags)["items"] });
      await this.gun
        .get(user)
        .once(user =>
          this.setState({ authorPhoto: user.photo, authorBio: user.bio })
        );
    }
  }

  render() {
    return (
      <PageContainer>
        <Title>{this.state.title}</Title>
        <CardContainer>
          <Card
            authorPhoto={this.state.authorPhoto}
            onFollowClick={() => {}}
            dateCreated={
              this.state.createdAt
                ? moment
                    .utc(this.state.createdAt)
                    .local()
                    .format("DD MMM, YYYY")
                : undefined
            }
            authorName={this.state.author}
          />
        </CardContainer>
        <ReadOnlyEditor data={this.state.content} />
        <div style={{ marginTop: "10px" }}>
          <ReactTagInput tags={this.state.tags} readOnly />
        </div>
        {this.state.editAllowed && (
          <button
            style={{
              marginTop: "10px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() =>
              this.props.history.push(this.props.location.pathname + "/edit")
            }
          >
            Edit Post
          </button>
        )}
        {/* <div style={{ marginTop: "26px" }}>
            <Vote
              onClickUpVote={() => {}}
              onClickDownVote={() => {}}
              upVoteCount={0}
              downVoteCount={0}
            />
          </div> */}
        <Divider />
        <LargeCardContainer>
          <LargeCard
            authorPhoto={this.state.authorPhoto}
            authorName={this.state.author}
            bio={this.state.authorBio}
          />
        </LargeCardContainer>
      </PageContainer>
    );
  }
}

const Title = styled.div`
  font-size: 40px;
  height: 40px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  font-family: Georgia;
`;

const CardContainer = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  margin-top: 57px;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  border: 1px solid black;
`;

const LargeCardContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

export default withRouter(Article);
