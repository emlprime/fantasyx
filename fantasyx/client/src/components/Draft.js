import React, {Component} from "react";
import {connect} from "react-redux";
import Button from "./Button";

const labelStyles = {
  width: "15em",
  float: "left",
  marginTop: ".9em",
};

const draftRowStyles = {
  listStyleType: "none",
};

const draftButtonStyles = {
  color: "black",
  fontWeight: "bold",
  outline: "1px solid black",
};

const disabledDraftButtonStyles = {
  color: "#DDD",
};

class Draft extends Component {
  constructor(props) {
    super(props);
    this.draftButton = this.draftButton.bind(this);
  }

  draftButton(can_draft, character_id) {
    if (this.props.can_draft) {
      return (
        <Button
          style={draftButtonStyles}
          onClick={() => {
            console.log("implement draft");
          }}
        >
          Draft
        </Button>
      );
    } else {
      return (
        <Button style={disabledDraftButtonStyles} disabled={true}>
          Draft
        </Button>
      );
    }
  }

  render() {
    return (
      <div>
        Characters available to Draft:
        <ul>
          {this.props.available_characters.map(character =>
            <li
              id={`character${character.id}`}
              key={`character_${character.id}`}
              style={draftRowStyles}
            >
              <div style={labelStyles}>
                {character.name}
              </div>
              {this.draftButton(this.props.can_draft, character.id)}
            </li>,
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user_identifier: state.user.user_identifier,
  available_characters: state.game.available_characters,
  can_draft: state.user.can_draft,
});
Draft = connect(mapStateToProps)(Draft);

export default Draft;
