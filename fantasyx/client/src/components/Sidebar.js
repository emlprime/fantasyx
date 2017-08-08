import React from "react";
import {Link} from "react-router-dom";
import "../App.css";

const sidebarStyles = {
  marginTop: "0px",
  listStyleType: "none",
  backgroundColor: "#511818",
  maxWidth: "10em",
  minWidth: "10em",
  height: "500px",
  float: "left",
};

const sidebarLinkStyles = {
  padding: ".5em",
};

const currentSectionStyles = {
  padding: ".5em",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  textDecoration: "none",
};

const sections = ["Characters", "Draft", "My Drafts", "Leaderboard", "Scores"];
const section_map = {
  Characters: "/characters",
  Draft: "/draft",
  "My Drafts": "/my_drafts",
  Leaderboard: "/leaderboard",
  Scores: "/scores",
};

const Sidebar = ({currentSection, style = {}}) =>
  <ul style={sidebarStyles}>
    {sections.map(section =>
      <li
        key={section}
        style={
          currentSection === section ? currentSectionStyles : sidebarLinkStyles
        }
      >
        <Link to={section_map[section]}>
          {section}
        </Link>
      </li>,
    )}
  </ul>;

Sidebar.propTypes = {};

export default Sidebar;
