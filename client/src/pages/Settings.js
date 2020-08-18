import React from "react";

import { Accordion, Icon, Button } from "semantic-ui-react";
import history from "../utils/History";
import Gun from "gun/gun";

import { PageContainer } from "../common/CommonStyles";
import PasswordReset from "../settings/PasswordReset";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this.gun = new Gun(
      JSON.parse(sessionStorage.getItem("currentPeers")).items
    );
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
            <PasswordReset user={this.user} gun={this.gun} />
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
            <Button
              negative
              size="small"
              content="Logout"
              onClick={() => {
                this.user.leave();
                history.push("/");
              }}
            />
          </Accordion.Content>
        </Accordion>
      </PageContainer>
    );
  }
}

export default Settings;
