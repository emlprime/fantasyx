import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {storiesOf, action, linkTo} from "@kadira/storybook";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chrome from "../components/Chrome";

storiesOf("Header", module)
  .add("with HotNakedBlondesWithDragons as a user", () =>
    <Router>
      <Header username="HotNakedBlondesWithDragons" />
    </Router>,
  )
  .add("with erife as a user", () =>
    <Router>
      <Header username="erife" />
    </Router>,
  );

storiesOf("Sidebar", module)
  .add("on the characters section", () =>
    <Router>
      <Sidebar currentSection="Characters" />
    </Router>,
  )
  .add("on the draft section", () =>
    <Router>
      <Sidebar currentSection="Draft" />
    </Router>,
  )
  .add("on the My Drafts section", () =>
    <Router>
      <Sidebar currentSection="My Drafts" />
    </Router>,
  )
  .add("on the leaderboard section", () =>
    <Router>
      <Sidebar currentSection="Leaderboard" />
    </Router>,
  )
  .add("on the scores section", () =>
    <Router>
      <Sidebar currentSection="Scores" />
    </Router>,
  );

storiesOf("Chrome", module)
  .add("with HotNakedBlondesWithDragons as a user", () =>
    <Chrome username="HotNakedBlondesWithDragons" />,
  )
  .add("with erife as a user", () => <Chrome username="erife" />)
  .add("with a subsection", () =>
    <Chrome username="erife" currentSection="Characters">
      Subsection
    </Chrome>,
  );
