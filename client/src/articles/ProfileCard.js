import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import Bio from "../profile/Bio";
import LazyImage from "../common/LazyImage";

class Card extends React.Component {
  render() {
    return (
      <ProfileCardContainer>
        <LazyImage
          src={this.props.authorPhoto}
          width={54}
          height={54}
          style={{ borderRadius: "50%" }}
        />
        <ArticleDetails>
          <div>{this.props.authorName}</div>
          <TimeDate>{this.props.dateCreated}</TimeDate>
        </ArticleDetails>
        <ButtonContainer>
          <button onClick={this.props.onFollowClick} disabled>Follow</button>
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
        <LazyImage
          src={this.props.authorPhoto}
          width={127}
          height={127}
          style={{ borderRadius: "50%" }}
        />
        <ProfileDetails>
          <LargeAuthorName>{this.props.authorName}</LargeAuthorName>
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
};

const LargeCardContainer = styled.div`
  width: 694px;
  height: 167px;
  display: flex;
  align-items: center;
  overflow: hidden;
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

const BioContainer = styled.div`
  margin-top: 10px;
  font-size: 15px;
`;

export { Card, LargeCard };
