import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import Bio from "../profile/Bio";
import ProfileImage from "../profile/ProfileImage";

class Card extends React.Component {
  render() {
    return (
      <ProfileCardContainer>
        <ProfileImage
          profilePhoto={this.props.authorPhoto}
          width={54}
          height={54}
        />
        <ArticleDetails>
          <AuthorName onClick={this.props.onProfileClick}>
            {this.props.authorName}
          </AuthorName>
          <TimeDate>{this.props.dateCreated}</TimeDate>
        </ArticleDetails>
        <ButtonContainer>
          <button onClick={this.props.onFollowClick} disabled>
            Follow
          </button>
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
  onProfileClick: PropTypes.func,
};

const ProfileCardContainer = styled.div`
  width: 280px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const AuthorName = styled.div`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

class LargeCard extends React.Component {
  render() {
    return (
      <LargeCardContainer>
        <ProfileImage
          profilePhoto={this.props.authorPhoto}
          width={127}
          height={127}
        />
        <ProfileDetails>
          <LargeAuthorName onClick={this.props.onProfileClick}>
            {this.props.authorName}
          </LargeAuthorName>
          <BioContainer>
            <Bio content={this.props.bio} />
          </BioContainer>
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
  onProfileClick: PropTypes.func,
};

const LargeCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const LargeAuthorName = styled.div`
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const BioContainer = styled.div`
  margin-top: 10px;
  font-size: 15px;
`;

export { Card, LargeCard };
