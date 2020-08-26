import React from "react";

import { Button, Header, Modal } from "semantic-ui-react";

import AuthenticationModal from "../components/authModal/AuthenticationModal";

export default {
  title: "Authentication Modal",
  component: AuthenticationModal,
};

export const AuthModal = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Login</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Username</Header>
            <input></input>
            <Header>Password</Header>
            <input></input>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Login
          </Button>
          <Button color="black" onClick={() => setOpen(false)}>
            SignUp
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};
