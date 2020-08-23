import React from "react";
import PropTypes from "prop-types";

import moment from "moment";
import styled from "styled-components";

import { kFormatter } from "./Vote";

const Pod = props => {
  return (
    <Container>
      <CoverPhoto src={props.coverPhoto} />
      <DescriptionContainer>
        <div>
          <Title>{props.title}</Title>
          <Body>{props.body}</Body>
        </div>
        <ExtraDetails>
          <div>
            <Author>{props.author}</Author>
            <TimeDate>
              {props.time
                ? moment.utc(props.dateCreated).local().format("DD MMM, YYYY")
                : undefined}
            </TimeDate>
          </div>
          <VotesContainer>
            <VoteCount>Up: {kFormatter(props.upVoteCount)}</VoteCount>
            <VoteCount>Down: {kFormatter(props.downVoteCount)}</VoteCount>
          </VotesContainer>
        </ExtraDetails>
      </DescriptionContainer>
    </Container>
  );
};

Pod.propTypes = {
  coverPhoto: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  upVoteCount: PropTypes.number.isRequired,
  downVoteCount: PropTypes.number.isRequired,
};

const Container = styled.div`
  width: 1064px;
  height: 374px;
  display: flex;
  align-items: flex-start;
`;

const CoverPhoto = styled.img`
  width: 56%;
  height: 100%;
  object-fit: cover;
`;

const DescriptionContainer = styled.div`
  margin-left: 16px;
  height: 100%;
  width: 44%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 40px;
  margin-top: 14px;
  margin-right: 14px;
  font-weight: bold;
`;

const Body = styled.div`
  margin-top: 30px;
  margin-right: 14px;
  font-size: 20px;
  color: #454545;
`;

const Author = styled.div`
  font-size: 15px;
  color: #454545;
`;

const TimeDate = styled.div`
  font-size: 15px;
  color: #454545;
`;

const ExtraDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

const VotesContainer = styled.div`
  display: flex;
`;

const VoteCount = styled.div`
  margin-left: 10px;
`;

export default Pod;
