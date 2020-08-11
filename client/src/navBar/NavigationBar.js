import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";
import styled from "styled-components";

class NavigationBar extends React.Component {
  render() {
    return (
      <NavContainer>
        {this.props.mainLogoButton}
        <ButtonsContainer>
          {/* <IconButton onClick={this.props.onSearchClick}>Search</IconButton>
          <IconButton onClick={this.props.onBookmarksClick}>
            Bookmarks
          </IconButton> */}
          {this.props.profileDropdown}
          {this.props.articleButton}
        </ButtonsContainer>
      </NavContainer>
    );
  }
}

NavigationBar.propTypes = {
  mainLogoButton: PropTypes.element,
  profileDropdown: PropTypes.element,
  onSearchClick: PropTypes.func,
  onBookmarksClick: PropTypes.func,
  articleButton: PropTypes.element,
};

const NavContainer = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconButton = props => (
  <Button size="tiny" styled={{ marginRight: "4px" }} {...props}></Button>
);

const MainLogo = styled.button`
  margin-left: 4px;
  margin-right: 4px;
`;

export default NavigationBar;
export { IconButton, MainLogo };
