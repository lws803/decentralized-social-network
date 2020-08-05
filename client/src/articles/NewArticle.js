import React from "react";

import SEA from "gun/sea";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";
import Validator from "jsonschema";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar, { IconButton } from "../navBar/NavigationBar";
import { NewArticleSchema } from "../common/Schemas";

class NewArticle extends React.Component {
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

  async postNewArticle(article) {
    var post = await this.user
      .get("posts")
      .get(article.uuid)
      .put(article, ack => {
        if (ack.err) alert(ack.err);
      });
    const ref = post["_"]["#"];
    var hash = await SEA.work(ref, null, null, { name: "SHA-256" });
    this.gun
      .get("#posts")
      .get(hash)
      .put(ref, ack => {
        if (ack.err) alert(ack.err);
      });
  }

  extractImgSrc(element) {
    if (!element) return undefined;
    const rawAttrs = element.rawAttrs;
    if (rawAttrs) {
      var srcURL = rawAttrs.substring(5);
      return srcURL.substring(0, srcURL.length - 1);
    }
    return rawAttrs;
  }

  publish() {
    const root = parse(this.state.content);
    const v = new Validator.Validator();
    var article = {
      uuid: uuidv4(),
      content: this.state.content,
      title: root.querySelector("h1").text,
      coverPhotoURL: this.extractImgSrc(root.querySelector("img")),
      tags: this.state.tags,  // TODO: Can't use tags as array here
    };
    const result = v.validate(article, NewArticleSchema);
    if (result.valid) {
      this.postNewArticle(article)
        .then(alert("posted"))
        .catch(err => alert(err));
    } else {
      alert(result.errors);
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

NewArticle.propTypes = {};

const Container = styled.div`
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;

export default NewArticle;
// TODO: Integrate gundb stuff into this
