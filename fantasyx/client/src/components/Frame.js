import React, {Component} from "react";
import {connect} from "react-redux";
import {Route} from "react-router-dom";
import Home from "./Home";
import Characters from "./Characters";
import Leaderboard from "./Leaderboard";
import Scores from "./Scores";
import Chrome from "./Chrome";
import Profile from "./Profile";
import {NotificationStack} from "react-notification";
import {removeNotification} from "../actions";

class Frame extends Component {
  render() {
    return (
      <Chrome username={this.props.username}>
        <Route exact path="/" component={Home} />
        <Route exact path="/user/:user_identifier" component={Home} />
        <Route exact path="/characters" component={Characters} />
        <Route exact path="/leaderboard" component={Leaderboard} />
        <Route exact path="/scores" component={Scores} />
        <Route exact path="/profile" component={Profile} />
        <NotificationStack
          notifications={this.props.notifications}
          onDismiss={notification =>
            this.props.removeNotification(notification)}
        />
      </Chrome>
    );
  }
}

const mapStateToProps = state => ({
  username: state.user.username,
  notifications: state.user.notifications,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeNotification: removeNotification,
});

Frame = connect(mapStateToProps, mapDispatchToProps)(Frame);

export default Frame;
