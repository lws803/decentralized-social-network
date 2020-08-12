import React from "react";

import { withRouter } from "react-router-dom";
import Gun from "gun/gun";
import SmallPodsCollection from "../articles/SmallPodsCollection";

class Author extends React.Component {
  constructor(props) {
    super(props);
    this.gun = new Gun([sessionStorage.getItem("currentPeer")]);
  }

  render() {
    const { user } = this.props.match.params;

    return <SmallPodsCollection gunSession={this.gun} pubKey={user} />;
  }
}

export default withRouter(Author);
