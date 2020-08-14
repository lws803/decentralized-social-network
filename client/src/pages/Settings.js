import React from "react";

import { Accordion, Icon } from "semantic-ui-react";

import Gun from "gun/gun";
import { PageContainer } from "../common/CommonStyles";
import PasswordReset from "../settings/PasswordReset";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
    this.user = this.gun.user().recall({ sessionStorage: true });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <PageContainer>
        {" "}
        <Accordion fluid styled>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Reset password
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <PasswordReset user={this.user} gun={this.gun}/>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Logout
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <p>
              There are many breeds of dogs. Each breed varies in size and
              temperament. Owners often select a breed of dog that they find to
              be compatible with their own lifestyle and desires from a
              companion.
            </p>
          </Accordion.Content>
        </Accordion>
      </PageContainer>
    );
  }
}

export default Settings;
