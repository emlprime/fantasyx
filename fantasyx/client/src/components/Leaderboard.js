import React, {Component} from "react";
import {connect} from "react-redux";
import Pivot from "quick-pivot";
import * as Table from "reactabular-table";
import Button from "./Button";

const tableStyles = {
  marginTop: "1em",
};

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.togglePivot = this.togglePivot.bind(this);
    this.reversePivotKey = this.reversePivotKey.bind(this);
    this.state = {
      pivot_key: "owner",
    };
  }

  reversePivotKey() {
    return this.state.pivot_key === "owner" ? "character_name" : "owner";
  }

  togglePivot() {
    this.setState({
      pivot_key: this.reversePivotKey(),
    });
  }

  render() {
    const {pivot_key} = this.state;
    const rowsToPivot = [pivot_key];
    const colsToPivot = ["episode_number"];
    const aggregationDimension = "score";
    const aggregator = "sum";

    const pivot = new Pivot(
      this.props.scores,
      rowsToPivot,
      colsToPivot,
      aggregationDimension,
      aggregator,
    );
    const pt = pivot.data.table;
    const col_source = pt.shift();
    const cols = col_source ? col_source.value : [];
    cols.shift();
    cols.sort();

    console.log("cols:", cols);

    const rows = pivot.data.table.map(row => {
      const row_data = {};
      const owner = row.value[0];
      row_data[pivot_key] = owner === "" ? "No one" : owner;

      let i = 1;
      let total = 0;
      cols.map(col => {
        row_data[col] = row.value[i];
        total += parseInt(row.value[i] || 0, 10);
        i++;
        return total;
      });
      row_data["total"] = total;
      return row_data;
    });

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
    return (
      <div>
        <h2>
          Scores by episode by {" "}
          <Button onClick={this.togglePivot}>
            {pivot_key_map[this.reversePivotKey()]}
          </Button>
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
});

Leaderboard = connect(mapStateToProps)(Leaderboard);

export default Leaderboard;
