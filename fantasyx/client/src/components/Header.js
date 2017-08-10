import React from "react";
import {Link} from "react-router-dom";
import "../App.css";

const headerStyles = {};

const h1Styles = {
  marginTop: ".3em",
  marginBottom: "0",
  color: "#c11d43",
  fontSize: "2.5em",
  width: "390px",
  padding: ".2em",
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
      <h1 style={h1Styles}>
        <img
          src="/lot_logo.png"
          width="400px"
          height="107px"
          alt="Leage of Thrones"
        />
      </h1>
    </Link>
  </div>;

Header.propTypes = {};

export default Header;
