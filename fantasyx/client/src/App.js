import React, {Component} from "react";
import "./App.css";
import Frame from "./components/Frame";
import {gotMessage} from "./redux";

class App extends Component {
  render() {
    const pathname = global.location.pathname;

    if (pathname.match(/\/user\//)) {
      const user_identifier = pathname.split("/")[2];
      gotMessage({type: "USER_IDENTIFIER", user_identifier});
    } else {
      console.log("no user identifier, we should log in");

      // Messy getting the production vs development hostname
      const hostname = global.location.host.split(":")[0];
      const host = hostname === "localhost" ? "localhost:5000" : hostname;
      const redirect_to = `http://${host}/api/login`;
      global.location.href = redirect_to;
    }
    return <Frame />;
  }
}

export default App;
