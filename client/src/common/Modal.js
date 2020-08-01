import React from "react";

import Modal from "react-modal";

Modal.setAppElement("body");
// Modal.defaultStyles.content.background = "transparent";
// Modal.defaultStyles.content.border = "none";
// Modal.defaultStyles.content.top = 0;
// Modal.defaultStyles.content.bottom = 0;
// Modal.defaultStyles.content.padding = 0;
// Modal.defaultStyles.overlay.backgroundColor = "rgba(0, 0, 0, 0.55)";
// Modal.defaultStyles.overlay.zIndex = "2";
// Modal.defaultStyles.overlay.overflow = "auto";
// Modal.defaultStyles.overlay.paddingTop = "16px";
// Modal.defaultStyles.overlay.paddingBottom = "16px";
// Modal.defaultStyles.overlay.display = "flex";
// Modal.defaultStyles.overlay.overflow = "auto";

class ModalView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default ModalView;
