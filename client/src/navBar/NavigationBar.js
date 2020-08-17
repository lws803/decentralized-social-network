import React from "react";
import PropTypes from "prop-types";

import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Button, Dropdown } from "semantic-ui-react";
import styled from "styled-components";

import PenyetLogo from "../res/penyet_small.png";
import history from "../utils/History";

class NavigationBar extends React.Component {
  render() {
    return (
      <NavContainer>
        <Link to="/">
          <Image src={PenyetLogo} size="tiny" style={{ marginLeft: "4px" }} />
        </Link>

        <ButtonsContainer>
          <Dropdown text="Profile" style={{ marginRight: "4px" }}>
            <Dropdown.Menu>
              <Dropdown.Item
                text="My Profile"
                onClick={() => history.push("/profile/my_profile")}
              />
              {this.props.user.is && (
                <Dropdown.Item
                  text="My Articles"
                  onClick={() => {
                    history.push(`/profile/author/~${this.props.user.is.pub}`);
                  }}
                />
              )}
              {this.props.user.is && (
                <Dropdown.Item
                  text="Settings"
                  onClick={() => {
                    history.push("/profile/settings");
                  }}
                />
              )}
              {this.props.user.is && (
                <Dropdown.Item
                  text="Logout"
                  onClick={() => {
                    this.props.user.leave();
                    window.location.reload(false);
                  }}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
          <IconButton onClick={() => history.push("/article/new")}>
            New Story
          </IconButton>
        </ButtonsContainer>
      </NavContainer>
    );
  }
}

NavigationBar.propTypes = {
  mainLogoButton: PropTypes.element,
  user: PropTypes.object,
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
