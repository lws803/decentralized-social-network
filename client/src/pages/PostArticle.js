import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import SEA from "gun/sea";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";
import Validator from "jsonschema";

import CustomCKEditor from "../common/CustomCKEditor";
import { NewArticleSchema, TagsSchema } from "../common/Schemas";
import { Errors } from "../common/Messages";
import { PageContainer } from "../common/CommonStyles";

class PostArticle extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
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
          this.props.history.push(`/article/${user}/${path}/${articleID}`);
        }
      });
    }
  }

  async getContent(articleID, path, user) {
    const article = await this.gun.get(user).get(path).get(articleID).once();
    if (article !== null)
      this.setState({
        ...article,
        tags: JSON.parse(article.tags)["items"],
        content: article.content,
        title: article.title,
      });
  }

  async postArticle(article) {
    var errors = [];
    var post = await this.user
      .get("posts")
      .get(article.uuid)
      .put(article, ack => {
        if (ack.err) errors.push(ack.err);
      });
    const ref = post["_"]["#"];
    var hash = await SEA.work(ref, null, null, { name: "SHA-256" });
    await this.gun
      .get("#posts")
      .get(hash)
      .put(ref, ack => {
        if (ack.err) errors.push(ack.err);
      });
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
    var article = {
      author: await this.user.get("alias").once(),
      uuid: this.state.uuid ? this.state.uuid : uuidv4(),
      createdAt: this.state.createdAt
        ? this.state.createdAt
        : date.toISOString(),
      updatedAt: this.state.uuid ? date.toISOString() : "",
      tags: JSON.stringify({ items: this.state.tags }),
      title: this.state.title,
      ...this.extractContentMetadata(),
    };

    const result = v.validate(article, NewArticleSchema, {
      propertyName: "article",
    });
    const tagsResult = v.validate(this.state.tags, TagsSchema, {
      propertyName: "tags",
    });
    var validationErrors = result.errors.concat(tagsResult.errors);
    if (validationErrors.length) alert(validationErrors.join("\n"));

    if (result.valid && tagsResult.valid) {
      this.postArticle(article)
        .then(ref => {
          this.props.history.push(`/article/${ref}`);
        })
        .catch(err => alert(err));
    }
  }

  async deleteArticle() {
    await this.user
      .get("posts")
      .get(this.state.uuid)
      .put(null, () => {
        this.props.history.push("/");
      });
  }

  render() {
    return (
      <PageContainer>
        <TitleInput
          placeholder="Enter title here..."
          onChange={event => this.setState({ title: event.target.value })}
          value={this.state.title}
        />
        <CustomCKEditor
          onChange={(event, editor) => {
            this.setState({ content: editor.getData() });
          }}
          data={this.state.content}
        />
        <ReactTagContainer>
          <ReactTagInput
            tags={this.state.tags}
            onChange={newTags => this.setState({ tags: newTags })}
            removeOnBackspace
            maxTags={10}
          />
        </ReactTagContainer>
        <ToolButtons>
          <PublishButton onClick={() => this.publish().then()}>
            {this.state.uuid ? "Edit" : "Publish New"}
          </PublishButton>
          {this.state.uuid && (
            <PublishButton onClick={() => this.deleteArticle().then()}>
              Delete
            </PublishButton>
          )}
        </ToolButtons>
      </PageContainer>
    );
  }
}

const PublishButton = styled.button`
  margin-top: 10px;
  margin-bottom: 50px;
  margin-right: 10px;
`;

const TitleInput = styled.input`
  font-size: 40px;
  font-weight: heavy;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  border: none;
  text-align: center;
  font-family: Georgia;
  outline: none;
`;

const ReactTagContainer = styled.div`
  margin-top: 10px;
`;

const ToolButtons = styled.div`
  display: flex;
`;

export default withRouter(PostArticle);
