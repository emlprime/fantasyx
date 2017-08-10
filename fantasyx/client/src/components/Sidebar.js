import React from "react";
import {Link} from "react-router-dom";
import "../App.css";

const sidebarStyles = {
  borderRadius: 4,
  marginTop: "0px",
  listStyleType: "none",
  backgroundColor: "rgba(81, 24, 24, 0.8)",
  boxShadow: "5px 5px 5px 5px rgba(90, 24, 25, 0.3)",
  maxWidth: "10em",
  minWidth: "10em",
  height: "500px",
  float: "left",
  marginRight: "30px",
};

const sidebarLinkStyles = {
  padding: ".5em",
};

const currentSectionStyles = {
  padding: ".5em",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  textDecoration: "none",
};

const sections = ["Characters", "Leaderboard", "Scores"];
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
