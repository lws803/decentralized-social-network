import React from "react";

import Gun from "gun/gun";
import styled from "styled-components";
import DOMPurify from "dompurify";

import { Card, LargeCard } from "./ProfileCard";

class Article extends React.Component {
  constructor(props) {
    super(props);
    // TODO: Use a mock ref here or mock data first
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    // this.gun.get("#posts").map().once(console.log)
    this.state = {
      content: undefined,
      author: undefined,
      title: undefined,
      createdAt: undefined,
    };
  }

  componentDidMount() {
    this.getContent();
  }

  getContent() {
    this.gun
      .get(
        "~H_XGlyWWdkWZtzdyJZEZot-eboc7Z8juH565DEU_k8I.yoGeHqAKRNSML9If4IkXfrqwd93GQ0jqcrjYvjIFJJQ/posts/b256844c-baa9-410f-b74e-31c4d865fa49"
      )
      .once(payload =>
        this.setState({
          author: JSON.parse(payload.author)[":"],
          content: JSON.parse(payload.content)[":"],
          title: JSON.parse(payload.title)[":"],
          createdAt: JSON.parse(payload.createdAt)[":"],
        })
      );
  }

  render() {
    return (
      <Container>
        <Title>{this.state.title}</Title>
        <Card
          authorPhoto={undefined}
          onFollowClick={() => {}}
          dateCreated={this.state.createdAt} // TODO: Beautify this using something like moment
          authorName={this.state.author}
        />
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(this.state.content || ""),
          }}
        ></div>
      </Container>
    );
  }
}

Article.propTypes = {};

const Title = styled.div`
  font-size: 40px;
  margin-top: 10px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
// TODO: See if align-items will affect the contents of the html element as well

export default Article;
