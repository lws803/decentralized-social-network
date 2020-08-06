import React from "react";
import PropTypes from "prop-types";

import Validator from "jsonschema";
import styled from "styled-components";

import ModalView from "../common/Modal";
import { AuthSchema } from "../common/Schemas";

class AuthenticationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
    };
  }

  validation() {
    const v = new Validator.Validator();
    const result = v.validate(this.state, AuthSchema, { propertyName: "user" });
    if (result.errors) {
      alert(result.errors.join("\n"));
    }
    return result;
  }

  render() {
    return (
      <ModalView {...this.props}>
        <UserForm>
          <div>
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.target.value })
              }
            />
          </div>
          <button
            onClick={() => {
              if (this.validation().valid) this.props.onSignup(this.state);
            }}
          >
            Sign up
          </button>
          <button
            onClick={() => {
              if (this.validation().valid) this.props.onLogin(this.state);
            }}
          >
            Login
          </button>
        </UserForm>
      </ModalView>
    );
  }
}

AuthenticationModal.propTypes = {
  onSignup: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  ...ModalView.propTypes,
};

const UserForm = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export default AuthenticationModal;
