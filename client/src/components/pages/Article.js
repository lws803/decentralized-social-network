/** @jsx jsx */

import React from "react";

import Gun from "gun/gun";
import { withRouter } from "react-router-dom";
import ReactTagInput from "@pathofdev/react-tag-input";
import styled from "styled-components";
import { Divider, Placeholder } from "semantic-ui-react";
import ReactFitText from "react-fittext";
import Interweave from "interweave";
import { css, jsx } from "@emotion/core";

import { transform } from "../articles/Embeddings";
import history from "../../utils/History";
import { Card, LargeCard } from "../articles/ProfileCard";
import { PageContainer, EditButton, ArticleBox } from "../common/CommonStyles";
import ArticleModel from "../../model/Article";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun(
      JSON.parse(sessionStorage.getItem("currentPeers")).items
    );
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

  getAuthorInfo(user) {
    return new Promise((resolve, reject) => {
      this.gun.get(user).once(ack => {
        if (ack.err) reject(ack.err);
        else resolve(ack);
      });
    });
  }

  async getContent(articleID, path, user) {
    const article = await this.gun.get(user).get(path).get(articleID).once();
    if (article !== null) {
      let author = await this.getAuthorInfo(user);
      this.setState({
        ...new ArticleModel(article).data,
        authorBio: author.bio,
        authorPhoto: author.photo,
      });
    }
  }

  goToProfile() {
    const { user } = this.props.match.params;
    history.push(`/profile/author/${user}`);
  }

  render() {
    return (
      <PageContainer>
        <ReactFitText
          compressor={2.5}
          css={css`
            width: 100%;
          `}
          maxFontSize={40}
          minFontSize={25}
        >
          <Title>{this.state.title}</Title>
        </ReactFitText>
        <CardContainer>
          <Card
            authorPhoto={this.state.authorPhoto}
            onFollowClick={() => {}}
            dateCreated={this.state.createdAt}
            authorName={this.state.author}
            onProfileClick={() => this.goToProfile()}
          />
        </CardContainer>
        {!this.state.content ? (
          <PlaceholderArticle
            css={css`
              width: 100%;
              margin-left: auto;
              margin-right: auto;
            `}
          />
        ) : (
          <div>
            <ArticleBox className="ck-content">
              <Interweave content={this.state.content} transform={transform} />
            </ArticleBox>
            <div
              css={css`
                margin-top: 10px;
              `}
            >
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
        <Divider
          css={css`
            width: 70%;
            margin-left: auto;
            margin-right: auto;
          `}
        />
        <LargeCardContainer>
          <LargeCard
            authorPhoto={this.state.authorPhoto}
            authorName={this.state.author}
            bio={this.state.authorBio}
            onProfileClick={() => this.goToProfile()}
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
`;

const ToolButtonsContainer = styled.div`
  margin-top: 10px;
`;

export default withRouter(Article);
