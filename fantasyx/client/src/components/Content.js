import React from "react";

const contentStyles = {
  paddingLeft: "1em",
};

const Content = ({rows = [], style = {}}) =>
  <div>
    {rows.map(row =>
      <p key={row} style={contentStyles}>
        {row}
      </p>,
    )}
  </div>;

export default Content;
