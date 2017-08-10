import React from "react";

const buttonStyles = {
  borderRadius: 5,
  outline: "none",
  fontSize: 15,
  padding: "3px 10px",
  boxShadow: "4px 4px 5px #888888",
};

const activeStyles = {
  color: "#ccc",
  border: "1px solid #000",
  backgroundColor: "#511818",
  cursor: "pointer",
};

const inactiveStyles = {
  color: "#EEE",
  border: "1px solid #DDD",
  backgroundColor: "#CCC",
};

const Button = ({children, active = true, onClick, style = {}}) =>
  <button
    style={{
      ...(active ? activeStyles : inactiveStyles),
      ...style,
      ...buttonStyles,
    }}
    onClick={active ? onClick : null}
  >
    {children}
  </button>;

export default Button;
