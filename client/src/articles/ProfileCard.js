import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

class Card extends React.Component {
  render() {
    return (
      <ProfileCardContainer>
        <ProfileImage src={this.props.authorPhoto} />
        <ArticleDetails>
          <AuthorName>{this.props.authorName}</AuthorName>
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
  margin-left: 17px;
`;

const AuthorName = styled.div``;

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

export default Card;
