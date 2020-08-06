import React from "react";
import PropTypes from "prop-types";

import Gun from "gun/gun";
import SEA from "gun/sea";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";
import Validator from "jsonschema";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar, { IconButton } from "../navBar/NavigationBar";
import { NewArticleSchema, TagsSchema } from "../common/Schemas";

class PostArticle extends React.Component {
  constructor(props) {
    // TODO: Find a way to make it such that the New story button becomes the publish button on
    // this page
    super(props);
    this.gun = new Gun([process.env.REACT_GUN_HOST_URL]);
    this.user = this.gun.user().recall({ sessionStorage: true });
    if (this.user.is) {
      console.log("user logged in");
    } else {
      // TODO: Show the login modal here
      console.log("user not logged in");
    }
    this.state = {
      tags: [] || this.props.tags,
      content: this.props.content
        ? this.props.content
        : sessionStorage.getItem("article:draft") || "",
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
  }

  extractContentMetadata(root) {
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
    return { coverPhoto: coverPhoto, title: title };
  }

  publish() {
    const root = parse(this.state.content);
    const v = new Validator.Validator();
    var date = new Date();
    var article = {
      uuid: this.props.uuid ? this.props.uuid : uuidv4(),
      content: this.state.content,
      createdAt: this.props.createdAt ? this.props.createdAt : date.toISOString(),
      updatedAt: this.props.uuid ? date.toISOString() : undefined,
      ...this.extractContentMetadata(root),
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
        .then(() => {
          // TODO: Take us away from this page -> exit this page
          console.log("posted");
        })
        .catch(err => alert(err));
    }
  }

  render() {
    return (
      <Container>
        <NavigationBar
          articleButton={
            <IconButton
              onClick={() => {
                this.publish();
              }}
            >
              {this.props.uuid ? "Save" : "Publish"}
            </IconButton>
          }
        />
        <CustomCKEditor
          onChange={(event, editor) => {
            this.setState({ content: editor.getData() });
          }}
          onBlur={() =>
            sessionStorage.setItem("article:draft", this.state.content)
          }
          data={this.state.content}
        />
        <ReactTagInput
          tags={this.state.tags}
          onChange={newTags => this.setState({ tags: newTags })}
          removeOnBackspace
          maxTags={10}
        />
      </Container>
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
`;

export default PostArticle;
