import React from "react";

const buttonStyles = {
  color: "#c11d43",
  border: "1px solid #000",
  borderRadius: 5,
  outline: "none",
  backgroundColor: "#511818",
  cursor: "pointer",
  fontSize: 15,
  padding: "3px 10px",
  boxShadow: "4px 4px 5px #888888",
};

const Button = ({children, onClick, style = {}}) =>
  <button style={{...buttonStyles, ...style}} onClick={onClick}>
    {children}
  </button>;

export default Button;
