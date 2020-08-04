import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

class Vote extends React.Component {
  kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  render() {
    return (
      <Container>
        <ButtonVoteNum>
          <button
            onClick={this.props.onClickUpVote}
            disabled={this.props.upDisabled}
          >
            U
          </button>
          <VoteCount>{this.kFormatter(this.props.upVoteCount)}</VoteCount>
        </ButtonVoteNum>
        <ButtonVoteNum>
          <button
            onClick={this.props.onClickDownVote}
            disabled={this.props.downDisabled}
          >
            D
          </button>
          <VoteCount>{this.kFormatter(this.props.downVoteCount)}</VoteCount>
        </ButtonVoteNum>
      </Container>
    );
  }
}

Vote.propTypes = {
  onClickUpVote: PropTypes.func.isRequired,
  onClickDownVote: PropTypes.func.isRequired,
  upVoteCount: PropTypes.func.isRequired,
  downVoteCount: PropTypes.func.isRequired,
  upDisabled: PropTypes.bool,
  downDisabled: PropTypes.bool,
};

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
