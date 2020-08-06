import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import ProfileDropdown from "./ProfileDropdown";

class NavigationBar extends React.Component {
  render() {
    return (
      <NavContainer>
        {this.props.mainLogoButton}
        <ButtonsContainer>
          <IconButton onClick={this.props.onSearchClick}>Search</IconButton>
          <IconButton onClick={this.props.onBookmarksClick}>
            Bookmarks
          </IconButton>
          <ProfileDropdown
            onProfileClick={this.props.onProfileClick}
            onSettingsClick={this.props.onSettingsClick}
            onFollowingClick={this.props.onFollowingClick}
          />
          {this.props.articleButton}
        </ButtonsContainer>
      </NavContainer>
    );
  }
}

NavigationBar.propTypes = {
  mainLogoButton: PropTypes.element,
  onSearchClick: PropTypes.func,
  onBookmarksClick: PropTypes.func,
  articleButton: PropTypes.element,
  onProfileClick: PropTypes.func,
  onSettingsClick: PropTypes.func,
  onFollowingClick: PropTypes.func,
};

const NavContainer = styled.div`
  display: flex;
  height: 40px;
  flex-direction: row;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: space-between;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const IconButton = styled.button`
  margin-left: 4px;
  margin-right: 4px;
`;

const MainLogo = styled.button`
  margin-left: 4px;
  margin-right: 4px;
`;

export default NavigationBar;
export { IconButton, MainLogo };
