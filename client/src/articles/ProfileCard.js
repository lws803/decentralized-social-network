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
  authorPhoto: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  onFollowClick: PropTypes.func.isRequired,
};

const ProfileCardContainer = styled.div`
  width: 305px;
  height: 58px;
  display: flex;
  align-items: center;
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
  width: 100px;
  height: 100%;
  margin-left: 30px;
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
  authorPhoto: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
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
