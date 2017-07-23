import React, {Component} from "react";
import Leaderboard from "./Leaderboard";

class BaseLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState();
    this.getScores = this.getScores.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.getScores();
    }, 100);
  }

  getScores() {
    const msg = JSON.stringify({
      type: "scores",
      options: {pivot: this.state.pivot, canon: this.state.canon},
    });
    this.props.ws.send(msg);
  }

  render() {
    const report = this.props.report;
    if (!report) {
      return <div> Loading...</div>;
    }
    return (
      <Leaderboard
        label={this.state.label}
        dataKey={this.state.dataKey}
        report={this.props.report}
      />
    );
  }
}

export default BaseLeaderboard;
