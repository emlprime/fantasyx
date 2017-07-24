import React from "react";
import {NavLink} from "react-router-dom";

import {Column, Table, AutoSizer} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

const navigationStyles = {
  padding: "1em",
};

const Leaderboard = ({label, dataKey, report}) =>
  <div>
    <div style={navigationStyles}>
      <NavLink to="/leaderboard/user/altfacts">User Altfacts</NavLink> |
      <NavLink to="/leaderboard/user/canon">User Canon</NavLink> |
      <NavLink to="/leaderboard/character/altfacts">
        Character Altfacts
      </NavLink>{" "}
      |
      <NavLink to="/leaderboard/character/canon">Character Canon</NavLink>
    </div>
    <AutoSizer>
      {({width}) =>
        <Table
          width={800}
          height={1500}
          headerHeight={20}
          rowHeight={30}
          rowCount={report.data.length}
          rowGetter={({index}) => report.data[index]}
        >
          <Column label={label} dataKey={dataKey} width={300} />
          {[1, 2, 3, 4, 5, 6, 7].map(episode_number =>
            <Column
              width={100}
              label={`S07E0${episode_number}`}
              dataKey={`S07E0${episode_number}`}
              key={`S07E0${episode_number}`}
            />,
          )}
        </Table>}
    </AutoSizer>
  </div>;

export default Leaderboard;
