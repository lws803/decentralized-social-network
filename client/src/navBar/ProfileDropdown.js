import React from "react";
import PropTypes from "prop-types";

import { Dropdown } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'

class ProfileDropdown extends React.Component {
  render() {
    return (
      <Dropdown text="Profile">
        <Dropdown.Menu>
          <Dropdown.Item text="My Profile" />
          <Dropdown.Item text="Following" />
          <Dropdown.Item text="Settings" />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default ProfileDropdown;
