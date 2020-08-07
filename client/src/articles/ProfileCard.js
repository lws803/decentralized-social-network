import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

class Card extends React.Component {
  render() {
    return (
      <ProfileCardContainer>
        <ProfileImage src={this.props.authorPhoto} />
        <ArticleDetails>
          <div>{this.props.authorName}</div>
          <TimeDate>{this.props.dateCreated}</TimeDate>
        </ArticleDetails>
        <ButtonContainer>
          <button onClick={this.props.onFollowClick}>Follow</button>
        </ButtonContainer>
      </ProfileCardContainer>
    );
  }
}

Card.propTypes = {
  authorPhoto: PropTypes.string,
  authorName: PropTypes.string,
  dateCreated: PropTypes.string,
  onFollowClick: PropTypes.func,
};

const ProfileCardContainer = styled.div`
  width: 280px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileImage = styled.img`
  height: 54px;
  width: 54px;
  object-fit: cover;
  border-radius: 50%;
`;

const ArticleDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const TimeDate = styled.div`
  margin-top: 5px;
  font-weight: 200;
`;

const ButtonContainer = styled.div`
  height: 100%;
  padding-top: 10px;
`;

class LargeCard extends React.Component {
  render() {
    return (
      <LargeCardContainer>
        <LargeProfileImage src={this.props.authorPhoto} />
        <ProfileDetails>
          <LargeAuthorName>{this.props.authorName}</LargeAuthorName>
          <Bio>{this.props.bio}</Bio>
        </ProfileDetails>
      </LargeCardContainer>
    );
  }
}

LargeCard.propTypes = {
  authorPhoto: PropTypes.string,
  authorName: PropTypes.string,
  dateCreated: PropTypes.string,
  bio: PropTypes.string,
};

const LargeCardContainer = styled.div`
  width: 694px;
  height: 167px;
  display: flex;
  align-items: center;
`;

const LargeProfileImage = styled.img`
  height: 127px;
  width: 127px;
  object-fit: cover;
  border-radius: 50%;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const LargeAuthorName = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const Bio = styled.div`
  margin-top: 10px;
  font-size: 15px;
`;

export { Card, LargeCard };
