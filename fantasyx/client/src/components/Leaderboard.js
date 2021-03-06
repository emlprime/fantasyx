import React, {Component} from "react";
import {connect} from "react-redux";
import Pivot from "quick-pivot";
import * as Table from "reactabular-table";
import Button from "./Button";
import Select from "./Select";

const tableStyles = {
  marginTop: "1em",
};

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.togglePivot = this.togglePivot.bind(this);
    this.reversePivotKey = this.reversePivotKey.bind(this);
    this.toggleCanonFilter = this.toggleCanonFilter.bind(this);
    this.reverseCanonFilter = this.reverseCanonFilter.bind(this);
    this.filterScores = this.filterScores.bind(this);
    this.changeOwnerFilter = this.changeOwnerFilter.bind(this);
    this.state = {
      pivot_key: "owner",
      canon_filter: "canon",
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

  reversePivotKey() {
    return this.state.pivot_key === "owner" ? "character_name" : "owner";
  }

  reverseCanonFilter() {
    return this.state.canon_filter === "canon" ? "altfacts" : "canon";
  }

  changeOwnerFilter(event) {
    const owner_filter = event.target.value;
    this.setState({owner_filter});
  }

  togglePivot() {
    this.setState({
      pivot_key: this.reversePivotKey(),
    });
  }

  toggleCanonFilter() {
    this.setState({
      canon_filter: this.reverseCanonFilter(),
    });
  }

  render() {
    const {pivot_key} = this.state;
    const rowsToPivot = [pivot_key];
    const colsToPivot = ["episode_number"];
    const aggregationDimension = "score";
    const aggregator = "sum";

    const scores = this.filterScores(this.props.scores);

    const pivot = new Pivot(
      scores,
      rowsToPivot,
      colsToPivot,
      aggregationDimension,
      aggregator,
    );
    const pt = pivot.data.table;
    const col_source = pt.shift();
    const cols = col_source ? col_source.value.slice(1) : [];
    const rows = pivot.data.table.map(row => {
      const row_data = {total: 0};
      const values = row.value.slice(1);
      const owner = row.value[0];
      row_data[pivot_key] = owner === "" ? "No one" : owner;

      for (let i = 0; i < cols.length; i++) {
        row_data[cols[i]] = values[i];
        row_data.total += parseInt(values[i] || 0, 10);
      }
      return row_data;
    });

    cols.sort();
    rows.sort((a, b) => (a.total > b.total ? -1 : 1));

    const owner = rows[0].owner;
    rows[0].owner = (
      <span>
        {owner}
        <img src="/first_place.png" width="24px" />
      </span>
    );

    const columns = [
      {
        property: pivot_key,
        header: {
          label: pivot_key,
          props: {
            style: {
              width: 200,
              textAlign: "left",
            },
          },
        },
      },
      ...cols.map(col => ({
        property: col,
        props: {style: {textAlign: "right"}},
        header: {
          label: col,
          props: {
            style: {
              width: 100,
              textAlign: "right",
            },
          },
        },
      })),
      {
        property: "total",
        props: {style: {textAlign: "right"}},
        header: {
          label: "Total",
          props: {
            style: {
              width: 50,
              textAlign: "right",
            },
          },
        },
      },
    ];

    const pivot_key_map = {character_name: "owner", owner: "character"};
    const canon_filter_map = {canon: "AltFacts", altfacts: "Canon"};
    return (
      <div>
        <h2>
          Scores by episode by {" "}
          <Button onClick={this.togglePivot}>
            {pivot_key_map[this.reversePivotKey()]}
          </Button>{" "}
          using {" "}
          <Button onClick={this.toggleCanonFilter}>
            {canon_filter_map[this.reverseCanonFilter()]}
          </Button>{" "}
          for
          <Select
            options={["All", ...this.props.owners.map(owner => owner.username)]}
            onChange={this.changeOwnerFilter}
          />{" "}
          players
        </h2>
        <Table.Provider columns={columns} style={tableStyles}>
          <Table.Header />
          <Table.Body rows={rows} rowKey={pivot_key} />
        </Table.Provider>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  scores: state.game.scores,
  owners: state.game.owners,
});

Leaderboard = connect(mapStateToProps)(Leaderboard);

export default Leaderboard;
