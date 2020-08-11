import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import moment from "moment";
import { Divider, Placeholder } from "semantic-ui-react";
import ReactFitText from "react-fittext";

import history from "../utils/History";
import { Card, LargeCard } from "../articles/ProfileCard";
// import Vote from "./Vote";
import ReadOnlyEditor from "../common/ReadOnlyEditor";
import { PageContainer, EditButton } from "../common/CommonStyles";

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
        <ReactFitText
          compressor={2.5}
          style={{ width: "100%" }}
          maxFontSize={40}
          minFontSize={25}
        >
          <Title>{this.state.title}</Title>
        </ReactFitText>
        {/* <Title>{this.state.title}</Title> */}
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
        {!this.state.content ? (
          <PlaceholderArticle
            style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
          />
        ) : (
          <div>
            <ReadOnlyEditor data={this.state.content} />
            <div style={{ marginTop: "10px" }}>
              <ReactTagInput tags={this.state.tags} readOnly />
            </div>
            <ToolButtonsContainer>
              {this.state.editAllowed && (
                <EditButton
                  onClick={() =>
                    history.push(this.props.location.pathname + "/edit")
                  }
                >
                  Edit
                </EditButton>
              )}
            </ToolButtonsContainer>
          </div>
        )}
        {/* <div style={{ marginTop: "26px" }}>
            <Vote
              onClickUpVote={() => {}}
              onClickDownVote={() => {}}
              upVoteCount={0}
              downVoteCount={0}
            />
          </div> */}
        <Divider
          style={{ width: "70%", marginLeft: "auto", marginRight: "auto" }}
        />
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

const PlaceholderArticle = props => (
  <Placeholder {...props}>
    <Placeholder.Image />
    <Placeholder.Paragraph>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Paragraph>
    <Placeholder.Header image>
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Header>
    <Placeholder.Paragraph>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Paragraph>
  </Placeholder>
);

const Title = styled.div`
  font-weight: heavy;
  margin-top: 20px;
  height: 40px;
  text-align: center;
  font-family: Georgia;
`;

const CardContainer = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
`;

const LargeCardContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
`;

const ToolButtonsContainer = styled.div`
  margin-top: 10px;
`;

export default withRouter(Article);
