import React, {Component} from "react";
import {connect} from "react-redux";
import * as Table from "reactabular-table";
import Button from "./Button";
import Select from "./Select";

const tableStyles = {
  marginTop: "1em",
};

const formatColumn = (name, label, type = "text") => ({
  property: name,
  textAlign: type === "text" ? "left" : "right",
  header: {
    label: label,
    props: {
      style: {
        width: 200,
        textAlign: type === "text" ? "left" : "right",
      },
    },
  },
});

class Scores extends Component {
  constructor(props) {
    super(props);
    this.toggleCanonFilter = this.toggleCanonFilter.bind(this);
    this.reverseCanonFilter = this.reverseCanonFilter.bind(this);
    this.filterScores = this.filterScores.bind(this);
    this.changeOwnerFilter = this.changeOwnerFilter.bind(this);
    this.state = {
      canon_filter: "altfacts",
      owner_filter: "All",
    };
  }

  filterScores() {
    const scores =
      this.state.canon_filter === "altfacts"
        ? this.props.scores
        : this.props.scores.filter(
            score => score.canon === this.state.canon_filter,
          );
    return this.state.owner_filter === "All"
      ? scores
      : scores.filter(score => score.owner === this.state.owner_filter);
  }

  reverseCanonFilter() {
    return this.state.canon_filter === "altfacts" ? "canon" : "altfacts";
  }

  toggleCanonFilter() {
    this.setState({
      canon_filter: this.reverseCanonFilter(),
    });
  }

  changeOwnerFilter(event) {
    const owner_filter = event.target.value;
    this.setState({owner_filter});
  }

  render() {
    const columns = [
      formatColumn("character_name", "Character"),
      formatColumn("episode_number", "Ep No"),
      formatColumn("canon", "Canon"),
      formatColumn("owner", "Player"),
    ];

    const canon_filter_map = {canon: "AltFacts", altfacts: "Canon"};

    return (
      <div>
        <h2>
          Scores for{" "}
          <Button onClick={this.toggleCanonFilter}>
            {canon_filter_map[this.reverseCanonFilter()]}
          </Button>{" "}
          rubric, showing{" "}
          <Select
            options={["All", ...this.props.owners.map(owner => owner.username)]}
            onChange={this.changeOwnerFilter}
          />{" "}
          players
        </h2>
        <Table.Provider columns={columns} style={tableStyles}>
          <Table.Header />
          <Table.Body rows={this.filterScores()} rowKey="id" />
        </Table.Provider>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  scores: state.game.scores,
  owners: state.game.owners,
});

Scores = connect(mapStateToProps)(Scores);

export default Scores;
