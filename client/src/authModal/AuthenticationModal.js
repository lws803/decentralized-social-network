import React from "react";

import ModalView from "../common/Modal";
import styled from "styled-components";

class AuthenticationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
    };
  }

  validation() {
    // TODO: Add validation here
    return true;
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
              if (this.validation()) this.props.onSignup(this.state);
            }}
          >
            Sign up
          </button>
          <button
            onClick={() => {
              if (this.validation()) this.props.onLogin(this.state);
            }}
          >
            Login
          </button>
        </UserForm>
      </ModalView>
    );
  }
}

export default AuthenticationModal;

const UserForm = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
  align-items: center;
  // justify-content: space-between;
`;
