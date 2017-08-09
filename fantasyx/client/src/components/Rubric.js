import React, {Component} from "react";
import "../App.css";
import RubricSection from "./RubricSection";
import Button from "./Button";

class Rubric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kind: "altfacts",
    };

    this.handleToggleKind = this.handleToggleKind.bind(this);
  }

  getToggledKind() {
    return this.state.kind === "altfacts" ? "canon" : "altfacts";
  }

  handleToggleKind() {
    this.setState({
      kind: this.getToggledKind(),
    });
  }

  render() {
    if (!this.props.sections) {
      return <p />;
    }
    return (
      <div>
        <Button onClick={this.handleToggleKind}>
          Filter to {this.getToggledKind()}
        </Button>
        <ul>
          <li>
            {this.props.sections.map(section =>
              <RubricSection
                title={section.title}
                kind={this.state.kind}
                data={section.data}
                key={`${section.title}`}
              />,
            )}
          </li>
        </ul>
      </div>
    );
  }
}

Rubric.propTypes = {};

export default Rubric;
