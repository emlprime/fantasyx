import React, {Component} from "react";
import {connect} from "react-redux";
import {Route} from "react-router-dom";
import Home from "./Home";
import Characters from "./Characters";
import Leaderboard from "./Leaderboard";
import Scores from "./Scores";
import Chrome from "./Chrome";

class Frame extends Component {
  render() {
    return (
      <Chrome username={this.props.username}>
        <Route exact path="/" component={Home} />
        <Route exact path="/characters" component={Characters} />
        <Route exact path="/leaderboard" component={Leaderboard} />
        <Route exact path="/scores" component={Scores} />
      </Chrome>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
  };
};

Frame = connect(mapStateToProps)(Frame);

export default Frame;
