import React from "react";

import SEA from "gun/sea";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar, { IconButton } from "../navBar/NavigationBar";

async function newPost(user, gunSession, content) {
  const postUUID = uuidv4();
  var post = await user
    .get("posts")
    .get(postUUID)
    .put({ content: content, uuid: postUUID }, ack => {
      if (ack.err) console.log(ack.err); // TODO: Throw the error properly
    });
  const ref = post["_"]["#"];
  var hash = await SEA.work(ref, null, null, { name: "SHA-256" });
  gunSession
    .get("#posts")
    .get(hash)
    .put(ref, ack => {
      if (ack.err) console.log(ack.err); // TODO: Throw the error properly
    });
}

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

  publish() {
    // const root = parse(this.state.content);
    // const title = root.querySelector("h1").text;
    // const coverPhoto = root.querySelector("img").rawAttrs;
    // Find the first para with text
    // const firstPara = root.querySelector("p").text;
    // console.log(firstPara);
    newPost(this.user, this.gun, this.state.content).then(
      // this.gun
      //   .get("#posts")
      //   .map()
      //   .once(ref =>
      //     this.gun.get(ref).once(payload => {
      //       console.log(payload);
      //     })
      //   )
      console.log("posted")
    );
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
