import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {storiesOf, action, linkTo} from "@kadira/storybook";

import Frame from "../components/Frame";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chrome from "../components/Chrome";
import RubricSection from "../components/RubricSection";
import Rubric from "../components/Rubric";
import Button from "../components/Button";
import Content from "../components/Content";

import Home from "../components/Home";
import Characters from "../components/Characters";
import Draft from "../components/Draft";
import MyDrafts from "../components/MyDrafts";

import {Provider} from "react-redux";
import {store} from "../redux";
import {gotRubric, gotIntroduction} from "../actions.js";

import IntroductionMessage from "../stub_messages/introduction_stub.json";
import RubricMessage from "../stub_messages/rubric_stub.json";
import CharacterMessage from "../stub_messages/character_stub.json";
import UserDataMessage from "../stub_messages/user_data_stub.json";

storiesOf("Header", module)
  .addDecorator(getStory =>
    <Router>
      {getStory()}
    </Router>,
  )
  .add("with HotNakedBlondesWithDragons as a user", () =>
    <Header username="HotNakedBlondesWithDragons" />,
  )
  .add("with erife as a user", () => <Header username="erife" />);

storiesOf("Sidebar", module)
  .addDecorator(getStory =>
    <Router>
      {getStory()}
    </Router>,
  )
  .add("on the characters section", () =>
    <Sidebar currentSection="Characters" />,
  )
  .add("on the draft section", () => <Sidebar currentSection="Draft" />)
  .add("on the My Drafts section", () => <Sidebar currentSection="My Drafts" />)
  .add("on the leaderboard section", () =>
    <Sidebar currentSection="Leaderboard" />,
  )
  .add("on the scores section", () => <Sidebar currentSection="Scores" />);

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

const sex_data = [
  {description: "Cockblock/Clam Jam", points: -20, kind: "canon"},
  {description: "Bold come-ons", points: 5, kind: "altfacts"},
];

const blood_data = [
  {description: "Kill an individual", points: 30, kind: "canon"},
  {description: "Charge a dragon", points: 55, kind: "altfacts"},
];

const rubric_sections = [
  {title: "Sex", data: sex_data},
  {title: "Blood", data: blood_data},
];

storiesOf("RubricSection", module)
  .add("with sex canon", () => <RubricSection data={sex_data} kind="canon" />)
  .add("with sex altfacts", () =>
    <RubricSection data={sex_data} kind="altfacts" />,
  );

storiesOf("Rubric", module).add("with all canon", () =>
  <Rubric sections={rubric_sections} />,
);

storiesOf("Button", module).add("some text", () => <Button>Some Text </Button>);

storiesOf("Content", module).add("some content", () =>
  <Content rows={IntroductionMessage.introduction} />,
);

storiesOf("Sections", module)
  .addDecorator(getStory =>
    <Provider store={store}>
      {getStory()}
    </Provider>,
  )
  .add("Home with content and rubric", () =>
    <Home
      content={IntroductionMessage.introduction}
      rubric_sections={rubric_sections}
    />,
  )
  .add("Characters", () => <Characters />)
  .add("Draft", () => <Draft />)
  .add("MyDrafts", () => <MyDrafts />)
  .add("Frame", () => <Frame />);

store.dispatch(UserDataMessage);
setTimeout(() => {
  store.dispatch(RubricMessage);
  store.dispatch(IntroductionMessage);
  store.dispatch(CharacterMessage);
}, 100);
