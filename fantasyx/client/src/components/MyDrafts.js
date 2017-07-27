import React, {Component} from "react";
import {connect} from "react-redux";
import Button from "./Button";

const labelStyles = {
  width: "15em",
  float: "left",
  marginTop: ".9em",
};

const releaseRowStyles = {
  listStyleType: "none",
  width: "30em",
  float: "left",
};

const releaseButtonStyles = {
  float: "right",
  textAlign: "right",
};

class MyDraft extends Component {
  componentWillMount() {
    setTimeout(() => {
      this.getMyDrafts();
    }, 100);
  }

  getMyDrafts() {
    const msg = JSON.stringify({
      type: "my_drafts",
      user_identifier: this.props.user_identifier,
    });
    this.props.ws.send(msg);
  }

  release(character_id) {
    const msg = JSON.stringify({
      type: "release",
      user_identifier: this.props.user_identifier,
      character_id: character_id,
    });
    this.props.ws.send(msg);
  }

  render() {
    const characters = this.props.my_drafts || [];
    return (
      <div>
        Characters that you have drafted:
        <ul>
          {characters.map(character =>
            <li
              id={`character${character.id}`}
              key={`character_${character.id}`}
              style={releaseRowStyles}
            >
              <div style={labelStyles}>
                {character.name}
              </div>
              <Button
                style={releaseButtonStyles}
                onClick={() => {
                  this.release(character.id);
                }}
              >
                Release
              </Button>
            </li>,
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user_identifier: state.data.user_identifier,
  email: state.data.email,
  my_drafts: state.data.my_drafts,
  ws: state.data.ws,
});

const MyDraftContainer = connect(mapStateToProps)(MyDraft);

export default MyDraftContainer;
