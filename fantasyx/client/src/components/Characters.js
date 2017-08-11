import React, {Component} from "react";
import {connect} from "react-redux";
import Button from "./Button";
import Select from "./Select";
import {handleDraft, handleRelease} from "../actions";

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
  width: "80%",
};

const characterOwnerStyles = {
  width: "10%",
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
    this.setOwnerFilter = this.setOwnerFilter.bind(this);
    this.state = {
      owner_filter: "All",
    };
  }

  formatCharacterAction(character_id, username) {
    let action = (
      <Button
        active={this.props.can_draft}
        onClick={() => {
          this.props.handleDraft(character_id, this.props.username);
        }}
      >
        Draft
      </Button>
    );

    if (username) {
      if (username === this.props.username) {
        action = (
          <Button
            active={this.props.can_release}
            onClick={() => {
              this.props.handleRelease(character_id, this.props.username);
            }}
            style={{color: "#c11d43"}}
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

  setOwnerFilter(event) {
    this.setState({owner_filter: event.target.value});
  }

  filterCharacters(characters) {
    let owner_filter = null;
    if (this.state.owner_filter !== "All") {
      if (this.state.owner_filter !== "No One") {
        owner_filter = this.state.owner_filter;
      }
      return this.props.characters.filter(
        character => character.user === owner_filter,
      );
    } else {
      return this.props.characters;
    }
  }

  render() {
    return (
      <div>
        <ul id="characters">
          <li>
            <h2>
              Showing characters for:
              <Select
                options={[
                  "All",
                  "No One",
                  ...this.props.owners.map(owner => owner.username),
                ]}
                onChange={this.setOwnerFilter}
              />
            </h2>
          </li>
          {this.filterCharacters(this.props.characters).map(character =>
            <li
              id={`character${character.id}`}
              key={`character_${character.id}`}
              style={characterRowStyles}
            >
              <div style={characterStyles}>
                <div style={characterOwnerStyles}>
                  {this.formatCharacterAction(character.id, character.user)}
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
  can_release: state.user.can_release,
  username: state.user.username,
  characters: state.game.characters,
  owners: state.game.owners,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDraft: (character_id, username) => {
    dispatch(handleDraft({character_id, username}));
  },
  handleRelease: (character_id, username) => {
    dispatch(handleRelease({character_id, username}));
  },
});

Characters = connect(mapStateToProps, mapDispatchToProps)(Characters);

export default Characters;
