import React from "react";

import Gun from "gun/gun";
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
    this.getContent();
  }

  getContent() {
    const ref =
      "~H_XGlyWWdkWZtzdyJZEZot-eboc7Z8juH565DEU_k8I.yoGeHqAKRNSML9If4IkXfrqwd93GQ0jqcrjYvjIFJJQ/posts/31fea85f-ab8b-45fd-a482-d4bdc9e65f3e";
    this.gun.get(ref).once(payload => {
      this.setState({
        author: JSON.parse(payload.author)[":"],
        content: JSON.parse(payload.content)[":"],
        title: JSON.parse(payload.title)[":"],
        createdAt: JSON.parse(payload.createdAt)[":"],
      });
      this.gun
        .get(JSON.parse(payload.tags)[":"]["#"])
        .map()
        .once(tag => {
          this.setState(state => state.tags.push(JSON.parse(tag)[":"]));
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

export default Article;
