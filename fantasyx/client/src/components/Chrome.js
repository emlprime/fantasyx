import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import "../App.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
const outerContainerStyles = {
  Width: "750px",
};

const contentStyles = {
  width: "75%",
  margin: "auto",
  float: "left",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  minHeight: "510px",
  paddingLeft: "1em",
  overflowY: "auto",
  boxShadow: "5px 5px 25px 25px rgba(250, 240, 255, 0.3)",
};

const clearStyles = {clear: "both"};

const Chrome = ({children, username, currentSection, style = {}}) =>
  <Router>
    <div style={outerContainerStyles}>
      <Header username={username} />
      <Sidebar currentSection={currentSection} />
      <div id="content" style={contentStyles}>
        {children}
      </div>
      <div style={clearStyles}>&nbsp;</div>
    </div>
  </Router>;

Chrome.propTypes = {};

export default Chrome;
