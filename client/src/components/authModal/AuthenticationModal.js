import React from "react";
import PropTypes from "prop-types";

import Validator from "jsonschema";
import { Button, Header, Modal } from "semantic-ui-react";

import history from "../../utils/History";
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
      <Modal open={!this.state.authenticated} onClose={() => history.goBack()}>
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Username</Header>
            <input
              type="text"
              id="username_field"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
              onKeyDown={e => this._handleKeyDown(e)}
            />
            <Header>Password</Header>
            <input
              type="password"
              id="password_field"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.target.value })
              }
              onKeyDown={e => this._handleKeyDown(e)}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" id="authenticate_user_btn" onClick={() => this.authUser()}>
            Login
          </Button>
          <Button color="black" id="create_new_user_btn" onClick={() => this.createUser()}>
            Sign up
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

AuthenticationModal.propTypes = {
  user: PropTypes.object.isRequired,
  reload: PropTypes.func,
};

export default AuthenticationModal;
