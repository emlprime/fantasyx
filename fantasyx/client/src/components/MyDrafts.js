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

class MyDrafts extends Component {
  componentWillMount() {
    setTimeout(() => {
      this.getMyDrafts();
    }, 100);
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
    console.log("my drafts:", this.props.my_drafts);
    return (
      <div>
        Characters that you have drafted:
        <ul>
          {this.props.my_drafts.map(character =>
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
  my_drafts: state.user.my_drafts,
});

MyDrafts = connect(mapStateToProps)(MyDrafts);

export default MyDrafts;
