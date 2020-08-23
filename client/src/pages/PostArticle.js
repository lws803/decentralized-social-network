/** @jsx jsx */

import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import { DateTree } from "gun-util";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";
import Validator from "jsonschema";
import ReactFitText from "react-fittext";
import { css, jsx } from "@emotion/core";

import history from "../utils/History";
import CustomCKEditor from "../common/CustomCKEditor";
import { NewArticleSchema, TagsSchema } from "../common/Schemas";
import { Errors } from "../common/Messages";
import {
  PageContainer,
  EditButton,
  DeleteButton,
} from "../common/CommonStyles";
import ArticleModel from "../model/Article";

class PostArticle extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun(
      JSON.parse(sessionStorage.getItem("currentPeers")).items
    );
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      tags: [],
      uuid: undefined,
      content: undefined,
      author: undefined,
      title: "",
      createdAt: undefined,
    };
  }

  componentDidMount() {
    const { articleID, path, user } = this.props.match.params;
    if (articleID && path && user && this.user.is) {
      this.user.get("pub").once(pubKey => {
        if (pubKey === user.substring(1)) {
          this.getContent(articleID, path, user);
        } else {
          alert(Errors.no_edit_perms_article);
          const { articleID, path, user } = this.props.match.params;
          history.push(`/article/${user}/${path}/${articleID}`);
        }
      });
    }
  }

  async getContent(articleID, path, user) {
    const article = await this.gun.get(user).get(path).get(articleID).once();
    if (article !== null)
      this.setState({
        ...new ArticleModel(article).data,
      });
  }

  async postArticle(article) {
    var errors = [];
    var post = await this.user.get("posts").get(article.uuid).put(article);
    let tree = new DateTree(this.user.get("date_tree"), "second");
    const ref = post["_"]["#"];
    await tree.get(article.createdAt).put(article.uuid, ack => {
      if (ack.err) errors.push(ack.err);
    });
    // var hash = await SEA.work(ref, null, null, { name: "SHA-256" });
    // await this.gun
    //   .get("#posts")
    //   .get(hash)
    //   .put(ref, ack => {
    //     if (ack.err) errors.push(ack.err);
    //   });
    if (errors.length > 0) {
      throw new Error(errors);
    }
    return ref;
  }

  extractContentMetadata() {
    var root = parse(this.state.content);
    const coverPhotoElem = root.querySelector("img");
    var coverPhoto = "";
    if (coverPhotoElem && coverPhotoElem.rawAttrs) {
      var srcURL = coverPhotoElem.rawAttrs.substring(5);
      srcURL = srcURL.substring(0, srcURL.length - 1);
      coverPhoto = srcURL;
    }
    // Sanitize h1 contents
    var div = document.createElement("div");
    div.innerHTML = this.state.content;
    var elements = div.getElementsByTagName("h1");
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    var sanitizedContent = div.innerHTML;
    return { coverPhoto: coverPhoto, content: sanitizedContent };
  }

  async publish() {
    const v = new Validator.Validator();
    var date = new Date();
    var article = new ArticleModel({
      author: await this.user.get("alias").once(),
      uuid: this.state.uuid ? this.state.uuid : uuidv4(),
      createdAt: this.state.createdAt
        ? this.state.createdAt
        : date.toISOString(),
      updatedAt: this.state.uuid ? date.toISOString() : "",
      tags: this.state.tags,
      title: this.state.title,
      ...this.extractContentMetadata(),
    }).toGunData();
    const result = v.validate(article, NewArticleSchema, {
      propertyName: "article",
    });
    const tagsResult = v.validate(this.state.tags, TagsSchema, {
      propertyName: "tags",
    });
    var validationErrors = result.errors.concat(tagsResult.errors);
    if (validationErrors.length) throw new Error(validationErrors.join("\n"));

    if (result.valid && tagsResult.valid) {
      const ref = await this.postArticle(article);
      return ref;
    }
  }

  async deleteArticle() {
    await this.user.get("posts").get(this.state.uuid).put(null);
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
          <TitleInput
            placeholder="Enter title here..."
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </ReactFitText>
        <CustomCKEditor
          onChange={(event, editor) => {
            this.setState({ content: editor.getData() });
          }}
          data={this.state.content}
        />
        <ReactTagContainer>
          <ReactTagInput
            tags={this.state.tags}
            onChange={newTags => {
              function process(tag) {
                var processedTag = tag.toLowerCase();
                processedTag = processedTag.replace(/[^A-Z0-9]/gi, "");
                return processedTag;
              }
              this.setState({ tags: newTags.map(process) });
            }}
            removeOnBackspace
            maxTags={10}
          />
        </ReactTagContainer>
        <ToolButtonsContainer>
          <EditButton
            onClick={() =>
              this.publish()
                .then(ref => history.push(`/article/${ref}`))
                .catch(err => alert(err))
            }
          >
            {this.state.uuid ? "Save" : "Publish New"}
          </EditButton>
          {this.state.uuid && (
            <DeleteButton
              onClick={() =>
                this.deleteArticle()
                  .then(() =>
                    history.push(`/profile/author/~${this.user.is.pub}`)
                  )
                  .catch(err => {
                    alert(err);
                  })
              }
            >
              Delete
            </DeleteButton>
          )}{" "}
        </ToolButtonsContainer>
      </PageContainer>
    );
  }
}

const TitleInput = styled.input`
  font-weight: heavy;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  text-align: center;
  font-family: Georgia;
  outline: none;
`;

const ReactTagContainer = styled.div`
  margin-top: 10px;
`;

const ToolButtonsContainer = styled.div`
  margin-top: 10px;
`;

export default withRouter(PostArticle);
