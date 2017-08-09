import React, {Component} from "react";
import {connect} from "react-redux";
import "./App.css";
import Chrome from "./components/Chrome";
import Home from "./components/Home";

class App extends Component {
  constructor(props) {
    super(props);
    const pathname = global.location.pathname;
    this.getUserData = this.getUserData.bind(this);

    if (pathname.match(/\/user\//)) {
      const user_identifier = pathname.split("/")[2];
      /* console.log("got user identifier:", user_identifier);*/

      let getUserData = this.getUserData;

      this.props.ws.onopen = evt => {
        /* console.log(`websocket on open. send user data: ${user_identifier}`);*/
        getUserData(user_identifier);
      };

      this.props.gotUserIdentifier(user_identifier);
    } else {
      /* console.log("no user identifier, we should log in");*/

      // Messy getting the production vs development hostname
      const hostname = global.location.host.split(":")[0];
      const host = hostname === "localhost" ? "localhost:5000" : hostname;
      const redirect_to = `http://${host}/api/login`;
      global.location.href = redirect_to;
    }
  }

  getUserData(user_identifier) {
    const msg = JSON.stringify({
      type: "user_data",
      user_identifier: user_identifier,
    });
    /* console.log(`msg: ${msg}`);*/
    // console.log("this.props.ws.readystate:", this.props.ws.readyState);
    this.props.ws.send(msg);
  }

  render() {
    return (
      <Chrome username={this.props.username}>
        <Home />
        <NotificationStack
          notifications={this.props.notifications}
          onDismiss={notification =>
            this.props.removeNotification(notification)}
        />
      </Chrome>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user_identifier: state.data.user_identifier,
  username: state.data.username,
  notifications: state.data.notifications,
  ws: state.data.ws,
});

const mapDispatchToProps = {
  removeNotification,
  gotUserIdentifier,
};

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
