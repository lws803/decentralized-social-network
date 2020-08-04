import React from "react";

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

import CustomCKEditor from "../common/CustomCKEditor";
import NavigationBar from "../navBar/NavigationBar";

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
      <div>
        {/* TODO: Change new story button to publish */}
        <NavigationBar />
        <CustomCKEditor
          onChange={newContent => this.setState({ content: newContent })}
        />
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
// TODO: Integrate gundb stuff into this
