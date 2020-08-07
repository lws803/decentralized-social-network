import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import DOMPurify from "dompurify";
import moment from "moment";

import { Card, LargeCard } from "./ProfileCard";
import Vote from "./Vote";
import profileImage from "../res/7874219.jpeg";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.state = {
      content: undefined,
      author: undefined,
      title: undefined,
      createdAt: undefined,
      tags: [],
    };
  }

  componentDidMount() {
    const { articleID, path, user } = this.props.match.params;
    this.getContent(articleID, path, user);
  }

  async getContent(articleID, path, user) {
    const article = await this.gun.get(user).get(path).get(articleID).once();
    var tags = [];
    await this.gun
      .get(article.tags["#"])
      .map()
      .once(tag => tags.push(tag));
    this.setState({ ...article, tags: tags });
  }

  render() {
    return (
      <Container>
        <Title>{this.state.title}</Title>
        <CardContainer>
          <Card
            authorPhoto={profileImage}
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
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(this.state.content || ""),
          }}
        ></div>
        <TagContainer>
          <ReactTagInput tags={this.state.tags} readOnly />
        </TagContainer>
        <Vote
          onClickUpVote={() => {}}
          onClickDownVote={() => {}}
          upVoteCount={100}
          downVoteCount={10000}
        />
        <LargeCard
          authorPhoto={profileImage}
          authorName={this.state.author}
          bio="Nunc porta lectus vitae elit hendrerit porta. 
          Nulla facilisi. Nulla laoreet sapien at eros maximus elementum"
        />
      </Container>
    );
  }
}

Article.propTypes = {};

const Title = styled.div`
  font-size: 40px;
  height: 40px;
  margin-top: 10px;
`;

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContainer = styled.div`
  margin-top: 10px;
`;

const TagContainer = styled.div`
  width: 80%;
`;

export default withRouter(Article);
