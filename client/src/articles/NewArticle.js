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
      <PageContainer>
        <div>
          <NavigationBar />
          <CustomCKEditor />
        </div>
        <ReactTagInput
          tags={this.state.tags}
          onChange={newTags => this.setState({ tags: newTags })}
          removeOnBackspace
          maxTags={10}
        />
      </PageContainer>
    );
  }
}

NewArticle.propTypes = {};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

export default NewArticle;
