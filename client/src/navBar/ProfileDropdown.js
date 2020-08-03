import React from "react";
import PropTypes from "prop-types";

import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class ProfileDropdown extends React.Component {
  render() {
    return (
      <Dropdown text="Profile">
        <Dropdown.Menu>
          <Dropdown.Item text="My Profile" onClick={this.props.onProfileClick}/>
          <Dropdown.Item text="Following" onClick={this.props.onFollowingClick}/>
          <Dropdown.Item text="Settings" onClick={this.props.onSettingsClick}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

ProfileDropdown.propTypes = {
  onProfileClick: PropTypes.func,
  onFollowingClick: PropTypes.func,
  onSettingsClick: PropTypes.func
}

export default ProfileDropdown;
