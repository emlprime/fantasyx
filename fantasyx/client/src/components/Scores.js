import React from "react";
import {NavLink} from "react-router-dom";

import {Column, Table, AutoSizer} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

const navigationStyles = {
  padding: "1em",
};

const Scores = ({label, dataKey, report}) =>
  <div>
    <div style={navigationStyles}>
      <NavLink to="/scores/altfacts">Altfacts</NavLink> |
      <NavLink to="/scores/canon">Canon</NavLink>
    </div>
    <AutoSizer>
      {({width}) =>
        <Table
          width={1000}
          height={100000}
          headerHeight={20}
          rowHeight={30}
          rowCount={report.data.length}
          rowGetter={({index}) => report.data[index]}
        >
          <Column label={label} dataKey={dataKey} width={140} />
          {["points", "bonus", "ep"].map(key =>
            <Column width={80} label={key} dataKey={key} key={key} />,
          )}
          {["description", "notes"].map(key =>
            <Column width={350} label={key} dataKey={key} key={key} />,
          )}
        </Table>}
    </AutoSizer>
  </div>;

export default Scores;
