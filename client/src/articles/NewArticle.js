import React from "react";

import styled from "styled-components";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar from "../navBar/NavigationBar";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
  }
  render() {
    return (
      <div>
        <NavigationBar />
        <CustomCKEditor />
        <ReactTagInput
          tags={this.state.tags}
          onChange={newTags => this.setState({ tags: newTags })}
          removeOnBackspace
          maxTags={10}
        />
      </div>
    );
  }
}

NewArticle.propTypes = {};

export default NewArticle;
