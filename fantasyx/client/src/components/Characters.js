import React, {Component} from "react";
import {connect} from "react-redux";
import Button from "./Button";
import Select from "./Select";

const characterRowStyles = {
  listStyleType: "none",
  padding: "0em .2em",
  fontSize: ".7em",
};

const characterStyles = {};
const characterNameStyles = {
  padding: ".2em .2em",
  margin: 0,
  width: "60%",
};

const characterDescriptionStyles = {
  margin: 0,
  padding: ".2em",
};

const characterOwnerStyles = {
  width: "30%",
  float: "right",
  padding: "0.3em",
  textShadow: "2px 2px 2px #666",
};

const characterClearStyles = {
  clear: "both",
};

class Characters extends Component {
  constructor(props) {
    super(props);
    this.formatCharacterAction = this.formatCharacterAction.bind(this);
    this.filterCharacters = this.filterCharacters.bind(this);
    this.state = {
      characters: this.props.characters,
    };
  }

  formatCharacterAction(username) {
    let action = (
      <Button active={this.props.can_draft} onClick={this.props.handleDraft}>
        Draft
      </Button>
    );
    if (username) {
      if (username === this.props.username) {
        action = (
          <Button
            active={this.props.can_draft}
            onClick={this.props.handleRelease}
          >
            Release
          </Button>
        );
      } else {
        action = username;
      }
    }
    return (
      <p>
        {action}
      </p>
    );
  }

  filterCharacters(event) {
    const user = event.target.value;
    const characters =
      user !== "All"
        ? this.props.characters.filter(character => character.user === user)
        : this.props.characters;
    this.setState({characters});
  }

  render() {
    return (
      <div>
        <ul id="characters">
          <li>
            <h2>
              Characters:{" "}
              <Select
                options={[
                  "All",
                  ...this.props.owners.map(owner => owner.username),
                ]}
                onChange={this.filterCharacters}
              />
            </h2>
          </li>
          {this.state.characters.map(character =>
            <li
              id={`character${character.id}`}
              key={`character_${character.id}`}
              style={characterRowStyles}
            >
              <div style={characterStyles}>
                <div style={characterOwnerStyles}>
                  {this.formatCharacterAction(character.user)}
                </div>
                <h3 style={characterNameStyles}>
                  {character.name}
                </h3>
                <p style={characterDescriptionStyles}>
                  {character.description}
                </p>
                <div style={characterClearStyles}>&nbsp;</div>
              </div>
            </li>,
          )}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  can_draft: state.user.can_draft,
  username: state.user.username,
  characters: state.game.characters,
  owners: state.game.owners,
});

Characters = connect(mapStateToProps)(Characters);

export default Characters;
