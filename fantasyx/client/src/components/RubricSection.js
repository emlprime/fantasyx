import React from "react";
import "../App.css";
import * as Table from "reactabular-table";

const rubricSectionTitleStyles = {
  color: "#c11d43",
};

const columns = [
  {
    property: "description",
    header: {
      label: "Description",
      props: {
        style: {
          width: "80%",
          textAlign: "left",
        },
      },
    },
  },
  {
    property: "kind",
    header: {
      label: "Kind",
      props: {
        style: {
          width: 100,
          textAlign: "left",
        },
      },
    },
  },
  {
    property: "points",
    header: {
      label: "Points",
      props: {
        style: {
          width: 100,
          textAlign: "right",
        },
      },
    },
    cell: {
      props: {style: {textAlign: "right"}},
    },
  },
];

const filterCanon = data => {
  return data.filter(row => {
    return row.kind === "canon";
  });
};

const RubricSection = ({
  title = "",
  data = [],
  kind = "altfacts",
  style = {},
}) =>
  <div>
    {title &&
      <h3 style={rubricSectionTitleStyles}>
        {title}
      </h3>}
    <Table.Provider columns={columns}>
      <Table.Header />
      <Table.Body
        rows={kind === "canon" ? filterCanon(data) : data}
        rowKey="description"
      />
    </Table.Provider>
  </div>;

RubricSection.propTypes = {};

export default RubricSection;
