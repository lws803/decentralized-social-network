import React from "react";

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";
import { parse } from "node-html-parser";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar, { IconButton } from "../navBar/NavigationBar";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      content: "",
    };
  }

  publish() {
    const root = parse(this.state.content);
    // const title = root.querySelector("h1").text;
    // const coverPhoto = root.querySelector("img").rawAttrs;
    const firstPara = root.querySelector("p").text
    console.log(firstPara);
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
