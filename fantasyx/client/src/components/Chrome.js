import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "../App.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
const outerContainerStyles = {
  minWidth: "680px",
};

const contentStyles = {
  width: "75%",
  margin: "auto",
  float: "left",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  minHeight: "500px",
};

const clearStyles = {clear: "both"};

const Chrome = ({children, username, currentSection, style = {}}) =>
  <Router>
    <div style={outerContainerStyles}>
      <Header username={username} />
      <Sidebar currentSection={currentSection} />
      <div style={contentStyles}>
        {children}
      </div>
      <div style={clearStyles}>&nbsp;</div>
    </div>
  </Router>;

Chrome.propTypes = {};

export default Chrome;
