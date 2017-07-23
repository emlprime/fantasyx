import React, {Component} from "react";
import Scores from "./Scores";

class BaseScores extends Component {
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
      type: "raw_scores",
      options: {canon: this.state.canon},
    });
    this.props.ws.send(msg);
  }

  render() {
    const report = this.props.report;
    if (!report) {
      return <div> Loading...</div>;
    }
    return (
      <Scores
        label={this.state.label}
        dataKey={this.state.dataKey}
        report={this.props.report}
      />
    );
  }
}

export default BaseScores;
