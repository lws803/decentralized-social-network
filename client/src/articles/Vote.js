import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

const Vote = props => {
  return (
    <Container>
      <ButtonVoteNum>
        <button
          onClick={props.onClickUpVote}
          disabled={props.upDisabled}
        >
          U
        </button>
        <VoteCount>{kFormatter(props.upVoteCount)}</VoteCount>
      </ButtonVoteNum>
      <ButtonVoteNum>
        <button
          onClick={props.onClickDownVote}
          disabled={props.downDisabled}
        >
          D
        </button>
        <VoteCount>{kFormatter(props.downVoteCount)}</VoteCount>
      </ButtonVoteNum>
    </Container>
  );
};

Vote.propTypes = {
  onClickUpVote: PropTypes.func.isRequired,
  onClickDownVote: PropTypes.func.isRequired,
  upVoteCount: PropTypes.number,
  downVoteCount: PropTypes.number,
  upDisabled: PropTypes.bool,
  downDisabled: PropTypes.bool,
};

const Container = styled.div`
  display: flex;
  height: 32px;
  width: 172px;
  align-items: center;
`;

const ButtonVoteNum = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const VoteCount = styled.div`
  margin-left: 10px;
`;

export default Vote;
export { kFormatter };
