import React, { useState } from "react";

import { action } from "@storybook/addon-actions";
import ModalView from "../common/Modal";

export default {
  title: "ModalView",
  component: ModalView,
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
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
