import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import moment from "moment";

import { Card, LargeCard } from "./articles/ProfileCard";
// import Vote from "./Vote";
import profileImage from "../res/7874219.jpeg";
import ReadOnlyEditor from "./common/ReadOnlyEditor";

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
        {/* <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(this.state.content || ""),
          }}
        ></div> */}
        <ReadOnlyEditor data={this.state.content} />
        <div style={{ marginTop: "10px" }}>
          <ReactTagInput tags={this.state.tags} readOnly />
        </div>
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
            authorPhoto={profileImage}
            authorName={this.state.author}
            bio="Nunc porta lectus vitae elit hendrerit porta. 
          Nulla facilisi. Nulla laoreet sapien at eros maximus elementum"
          />
        </LargeCardContainer>
      </Container>
    );
  }
}

Article.propTypes = {};

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 40px;
  height: 40px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;

const CardContainer = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
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
