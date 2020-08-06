import React from "react";

import Gun from "gun/gun";

class Main extends React.Component {
  render() {
    var gunSession = new Gun([process.env.REACT_GUN_HOST_URL]);
    var user = gunSession.user().recall({ sessionStorage: true });
    user.auth("lws803", "cool", console.log); // Test user

    return "Hello world";
  }
}

export default Main;
