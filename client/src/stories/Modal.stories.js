import React, { useState } from "react";

import Gun from "gun/gun";

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
  var gunSession = new Gun([process.env.REACT_APP_GUN_HOST_URL]);
  var user = gunSession.user().recall({ sessionStorage: true });
  return (
    <AuthenticationModal
      isOpen={true}
      user={user}
    />
  );
};
