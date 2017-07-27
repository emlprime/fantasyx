import React, {Component} from "react";
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "./App.css";
import Characters from "./components/Characters";
import MyDrafts from "./components/MyDrafts";
import Draft from "./components/Draft";
import Home from "./components/Home";
import Profile from "./components/Profile";
import LeaderboardUserCanon from "./components/LeaderboardUserCanon";
import LeaderboardUserAltfacts from "./components/LeaderboardUserAltfacts";
import LeaderboardCharacterCanon from "./components/LeaderboardCharacterCanon";
import LeaderboardCharacterAltfacts from "./components/LeaderboardCharacterAltfacts";
import ScoresCanon from "./components/ScoresCanon";
import ScoresAltfacts from "./components/ScoresAltfacts";
import {NotificationStack} from "react-notification";

import {removeNotification, gotUserIdentifier} from "./actions";

import {Sidebar, SidebarItem} from "react-responsive-sidebar";

const headerStyles = {
  marginTop: "1em",
  color: "#c11d43",
  fontSize: "2.5em",
};

const subtitleStyles = {
  color: "#c11d43",
  fontSize: ".01em",
};

const pageWrapStyles = {
  width: "70%",
  margin: "auto",
};

const profileStyles = {
  float: "right",
};

class App extends Component {
  constructor(props) {
    super(props);
    const pathname = global.location.pathname;
    this.getUserData = this.getUserData.bind(this);

    if (pathname.match(/\/user\//)) {
      const user_identifier = pathname.split("/")[2];
      console.log("got user identifier:", user_identifier);

      let getUserData = this.getUserData;

      this.props.ws.onopen = evt => {
        console.log(`websocket on open. send user data: ${user_identifier}`);
        getUserData(user_identifier);
      };

      this.props.gotUserIdentifier(user_identifier);
    } else {
      console.log("no user identifier, we should log in");

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
    console.log(`msg: ${msg}`);
    // console.log("this.props.ws.readystate:", this.props.ws.readyState);
    this.props.ws.send(msg);
  }

  render() {
    const items = [
      <SidebarItem>
        <Link to="/">Home</Link>
      </SidebarItem>,
      <SidebarItem>
        <Link to="/characters">Characters</Link>
      </SidebarItem>,
      <SidebarItem>
        <Link to="/draft">Draft</Link>
      </SidebarItem>,
      <SidebarItem>
        <Link to="/my_drafts">My Drafts</Link>
      </SidebarItem>,
      <SidebarItem>
        <Link to="/leaderboard/user/altfacts">Leaderboard</Link>
      </SidebarItem>,
      <SidebarItem>
        <Link to="/scores/altfacts">Scores</Link>
      </SidebarItem>,
    ];

    return (
      <Router>
        <div id="outer-container">
          <Sidebar content={items} width={170} background="#23160d">
            <main id="page-wrap" style={pageWrapStyles}>
              <Link to="/profile" style={profileStyles}>
                <img
                  width="32px"
                  height="32px"
                  src="/profile.png"
                  alt="profile"
                />
              </Link>
              <h1 style={headerStyles}>aGoT</h1>
              <h2 style={subtitleStyles}>
                Crush your enemies. See them driven before you. Hear the
                lamentations of their women.
              </h2>
              <h3>
                Welcome {this.props.email}
              </h3>
              <Route exact path="/" component={Home} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/user/:user_identifier" component={Home} />
              <Route path="/characters" component={Characters} />
              <Route path="/draft" component={Draft} />
              <Route path="/my_drafts" component={MyDrafts} />
              <Route
                path="/leaderboard/user/altfacts"
                component={LeaderboardUserAltfacts}
              />
              <Route
                path="/leaderboard/user/canon"
                component={LeaderboardUserCanon}
              />
              <Route
                path="/leaderboard/character/canon"
                component={LeaderboardCharacterCanon}
              />
              <Route
                path="/leaderboard/character/altfacts"
                component={LeaderboardCharacterAltfacts}
              />
              <Route path="/scores/canon" component={ScoresCanon} />
              <Route path="/scores/altfacts" component={ScoresAltfacts} />
            </main>
          </Sidebar>
          <NotificationStack
            notifications={this.props.notifications}
            onDismiss={notification =>
              this.props.removeNotification(notification)}
          />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user_identifier: state.data.user_identifier,
  email: state.data.email,
  notifications: state.data.notifications,
  ws: state.data.ws,
});

const mapDispatchToProps = {
  removeNotification,
  gotUserIdentifier,
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
