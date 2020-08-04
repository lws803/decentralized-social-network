import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

class Vote extends React.Component {
  render() {
    return (
      <Container>
        <ButtonVoteNum>
          <button>U</button>
          <VoteCount>100</VoteCount>
        </ButtonVoteNum>
        <ButtonVoteNum>
          <button>D</button>
          <VoteCount>1000</VoteCount>
        </ButtonVoteNum>
      </Container>
    );
  }
}

Vote.propTypes = {};

const Container = styled.div`
  display: flex;
  height: 32px;
  width: 172px;
  justify-content: space-between;
  align-items: center;
`;

const ButtonVoteNum = styled.div`
  display: flex;
  align-items: center;
`;

const VoteCount = styled.div`
  margin-left: 10px;
`;

export default Vote;
