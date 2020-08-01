import React from "react";

import styled from "styled-components";

class NavigationBar extends React.Component {
  render() {
    return (
      <NavContainer>
        <MainLogo onClick={this.props.onLogoClick}>Main Logo</MainLogo>
        <ButtonsContainer>
          <IconButton onClick={this.props.onSearchClick}>Search</IconButton>
          <IconButton onClick={this.props.onBookmarksClick}>
            Bookmarks
          </IconButton>
          <IconButton onClick={this.props.onProfileClick}>Profile</IconButton>
        </ButtonsContainer>
      </NavContainer>
    );
  }
}

const NavContainer = styled.div`
  border-style: solid;
  display: flex;
  height: 40px;
  flex-direction: row;
  width: 100%;
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
