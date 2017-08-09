import React from "react";

const selectStyles = {
  borderRadius: 5,
  outline: "none",
  fontSize: 15,
  padding: "3px 10px",
  boxShadow: "4px 4px 5px #888888",
  marginLeft: "1em",
  marginRight: "1em",
};

const Select = ({
  options,
  onChange,
  default_value,
  context = "all",
  style = {},
}) =>
  <select
    style={{
      ...style,
      ...selectStyles,
    }}
    onChange={onChange}
    defaultValue={default_value}
  >
    {options.map(option =>
      <option key={`${context}_${option}`}>
        {option}
      </option>,
    )}
  </select>;

export default Select;
