import React from "react";
import PropTypes from "prop-types";

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
import AuthenticationModal from "../authModal/AuthenticationModal";

class PostArticle extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    this.state = {
      tags: [] || this.props.tags,
      content: this.props.content || "",
    };
  }

  async postArticle(article, tags) {
    var errors = [];
    var post = await this.user
      .get("posts")
      .get(article.uuid)
      .put(article, ack => {
        if (ack.err) errors.push(ack.err);
      });

    for (var i = 0; i < tags.length; i++) {
      await this.user
        .get("posts")
        .get(article.uuid)
        .get("tags")
        .set(tags[i], ack => {
          if (ack.err) errors.push(ack.err);
        });
    }
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
    const title = root.querySelector("h1")
      ? root.querySelector("h1").text
      : undefined;
    const coverPhotoElem = root.querySelector("img");
    var coverPhoto = undefined;
    if (coverPhotoElem && coverPhotoElem.rawAttrs) {
      var srcURL = coverPhotoElem.rawAttrs.substring(5);
      srcURL = srcURL.substring(0, srcURL.length - 1);
      coverPhoto = srcURL;
    }
    // Sanitize h1 contents
    var div = document.createElement('div');
    div.innerHTML = this.state.content;
    var elements = div.getElementsByTagName('h1');
    while (elements[0])
      elements[0].parentNode.removeChild(elements[0])
    var sanitizedContent = div.innerHTML
    return { coverPhoto: coverPhoto, title: title, content: sanitizedContent };
  }

  async publish() {
    const v = new Validator.Validator();
    var date = new Date();
    var article = {
      author: await this.user.get("alias").once(),
      uuid: this.props.uuid ? this.props.uuid : uuidv4(),
      createdAt: this.props.createdAt
        ? this.props.createdAt
        : date.toISOString(),
      updatedAt: this.props.uuid ? date.toISOString() : "",
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
      this.postArticle(article, this.state.tags)
        .then(ref => {
          this.props.history.push(`/article/${ref}`);
        })
        .catch(err => alert(err));
    }
  }

  render() {
    return (
      <div>
        <AuthenticationModal user={this.user} />
        <Container>
          <CustomCKEditor
            onChange={(event, editor) => {
              this.setState({ content: editor.getData() });
            }}
            data={this.state.content}
          />
          <ReactTagInput
            tags={this.state.tags}
            onChange={newTags => this.setState({ tags: newTags })}
            removeOnBackspace
            maxTags={10}
          />
          <PublishButton onClick={() => this.publish().then()}>
            Publish!
          </PublishButton>
        </Container>
      </div>
    );
  }
}

PostArticle.propTypes = {
  uuid: PropTypes.string,
  content: PropTypes.string,
  tags: PropTypes.array,
  createdAt: PropTypes.string,
};

const Container = styled.div`
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

const PublishButton = styled.button`
  margin-top: 10px;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
`;

export default withRouter(PostArticle);
