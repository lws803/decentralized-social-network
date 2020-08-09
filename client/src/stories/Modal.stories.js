import React, { useState } from "react";

import { action } from "@storybook/addon-actions";
import { Button, Header, Modal } from "semantic-ui-react";

import ModalView from "../common/Modal";
import AuthenticationModal from "../authModal/AuthenticationModal";

export default {
  title: "Modal View",
  component: ModalView,
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </button>
      <ModalView
        isOpen={isOpen}
        contentLabel="Example Modal"
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        Hello world
      </ModalView>
    </div>
  );
};

export const AuthModal = () => {
  var mockUser = {
    is: false,
    auth: action("login"),
    create: action("signup"),
  };
  return <AuthenticationModal user={mockUser} reload={action("reload")} />;
};

export const NewModal = () => {
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
