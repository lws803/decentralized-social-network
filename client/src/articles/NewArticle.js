import React from "react";

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import styled from "styled-components";

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
  render() {
    return (
      <Container>
        <NavigationBar
          articleButton={<IconButton onClick={() => {}}>Publish</IconButton>}
        />
        <CustomCKEditor
          onChange={newContent => this.setState({ content: newContent })}
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
