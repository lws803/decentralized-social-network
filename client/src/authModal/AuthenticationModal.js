import React from "react";
import PropTypes from "prop-types";

import Validator from "jsonschema";
import styled from "styled-components";

import ModalView from "../common/Modal";
import { AuthSchema } from "../common/Schemas";

class AuthenticationModal extends React.Component {
  constructor(props) {
    super(props);
    this.user = this.props.user;
    this.state = {
      name: "",
      password: "",
      authenticated: this.user.is,
    };
  }

  validation() {
    const v = new Validator.Validator();
    const result = v.validate(this.state, AuthSchema, { propertyName: "user" });
    if (result.errors.length) {
      alert(result.errors.join("\n"));
    }
    return result;
  }

  createUser() {
    if (this.validation().valid)
      this.user.create(this.state.name, this.state.password, ack => {
        if (ack.err) alert(ack.err);
        else {
          this.authUser();
        }
      });
  }

  authUser() {
    if (this.validation().valid)
      this.user.auth(this.state.name, this.state.password, ack => {
        if (ack.err) alert(ack.err);
        else {
          this.props.reload();
        }
      });
  }

  _handleKeyDown(e) {
    if (e.key === "Enter") {
      this.authUser();
    }
  }

  render() {
    return (
      <ModalView {...this.props} isOpen={!this.state.authenticated}>
        <UserForm>
          <Field>
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
              onKeyDown={e => this._handleKeyDown(e)}
            />
          </Field>
          <Field>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.target.value })
              }
              onKeyDown={e => this._handleKeyDown(e)}
            />
          </Field>
          <Button onClick={() => this.createUser()}>Sign up</Button>
          <Button onClick={() => this.authUser()}>Login</Button>
        </UserForm>
      </ModalView>
    );
  }
}

AuthenticationModal.propTypes = {
  user: PropTypes.any.isRequired,
  ...ModalView.propTypes,
};

const UserForm = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const Field = styled.div`
  width: 20%;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  margin-top: 10px;
`;

export default AuthenticationModal;
