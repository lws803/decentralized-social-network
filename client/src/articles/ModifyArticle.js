import React from "react";
import PropTypes from "prop-types";

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

class ModifyArticle extends React.Component {
  constructor(props) {
    super(props);
    this.gun = this.props.gunSession;
    this.user = this.props.user;
    if (this.user.is) {
      console.log("user logged in");
    } else {
      // TODO: Show the login modal here
      console.log("user not logged in");
    }
    this.state = {
      tags: [],
      content: sessionStorage.getItem("article:draft") || "",
    };
  }

  async postNewArticle(article, tags) {
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

  async getArticleFromUUID() {}

  extractContentMetadata(root) {
    const title = root.querySelector("h1")
      ? root.querySelector("h1").text
      : undefined;
    const coverPhotoElem = root.querySelector("img");
    var coverPhotoURL = undefined;
    if (coverPhotoElem && coverPhotoElem.rawAttrs) {
      var srcURL = coverPhotoElem.rawAttrs.substring(5);
      srcURL = srcURL.substring(0, srcURL.length - 1);
      coverPhotoURL = srcURL;
    }
    return { coverPhotoURL: coverPhotoURL, title: title };
  }

  publish() {
    const root = parse(this.state.content);
    const v = new Validator.Validator();
    var article = {
      uuid: uuidv4(),
      content: this.state.content,
      ...this.extractContentMetadata(root),
    };
    const result = v.validate(article, NewArticleSchema);
    const tagsResult = v.validate(this.state.tags, TagsSchema);
    if (!result.valid) alert(result.errors);
    if (!tagsResult.valid) alert(tagsResult.errors);

    if (result.valid && tagsResult.valid) {
      this.postNewArticle(article, this.state.tags)
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
            // TODO: Check if its editing existing document
            <IconButton
              onClick={() => {
                this.publish();
              }}
            >
              Publish
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

ModifyArticle.propTypes = {
  existingUUID: PropTypes.string,
};

const Container = styled.div`
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;

export default ModifyArticle;
// TODO: Check properties to see if exiting UUID is provided if it is, retrieve the post instead
