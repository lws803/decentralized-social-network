import React, { useState } from "react";

import { action } from "@storybook/addon-actions";
import ModalView from "../common/Modal";
import AuthenticationModal from "../authModal/AuthenticationModal";

export default {
  title: "ModalView",
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
  return (
    <AuthenticationModal
      isOpen={true}
      onSignup={action("sign up")}
      onLogin={action("login")}
    />
  );
};
