import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import DOMPurify from "dompurify";

import { Card, LargeCard } from "./ProfileCard";
import Vote from "./Vote";
import profileImage from "../res/7874219.jpeg";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    // this.gun.get("#posts").map().once(console.log)
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

  getContent(articleID, path, user) {
    this.gun
      .get(user)
      .get(path)
      .get(articleID)
      .once(payload => {
        this.setState({
          author: payload.author,
          content: payload.content,
          title: payload.title,
          createdAt: payload.createdAt,
        });
        this.gun
          .get(payload.tags["#"])
          .map()
          .once(tag => {
            this.setState(state => state.tags.push(tag));
          });
      });
  }

  render() {
    return (
      <Container>
        <Title>{this.state.title}</Title>
        <CardContainer>
          <Card
            authorPhoto={profileImage}
            onFollowClick={() => {}}
            dateCreated={this.state.createdAt} // TODO: Beautify this using something like moment
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
          dateCreated={this.state.createdAt}
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
// TODO: See if align-items will affect the contents of the html element as well

export default withRouter(Article);
