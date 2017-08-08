import React from "react";
import {Link} from "react-router-dom";
import "../App.css";

const headerStyles = {};

const h1Styles = {
  marginTop: ".3em",
  marginBottom: ".1em",
  color: "#c11d43",
  fontSize: "2.5em",
};

const subtitleStyles = {
  color: "#c11d43",
  fontSize: ".01em",
};

const profileStyles = {
  float: "right",
  marginTop: "0px",
};

const usernameStyles = {
  float: "left",
  marginTop: ".5em",
};

const Header = ({username, style = {}}) =>
  <div style={headerStyles}>
    <div style={profileStyles}>
      <p style={usernameStyles}>
        {username}
      </p>
      <Link to="/profile">
        <img width="32px" height="32px" src="/profile.png" alt="profile" />
      </Link>
    </div>
    <Link to="/">
      <h1 style={h1Styles}>aGoT</h1>
    </Link>
    <h2 style={subtitleStyles}>
      Crush your enemies. See them driven before you. Hear the lamentations of
      their women.
    </h2>
  </div>;

Header.propTypes = {};

export default Header;
