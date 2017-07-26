import React, {Component} from "react";
import {connect} from "react-redux";

const rowStyles = {
  width: "100%",
  height: "3em",
  marginBottom: "1.5em",
};

const labelStyles = {
  width: "100%",
  textSize: "3em",
};

const inputStyles = {
  width: "100%",
  height: "3em",
};

class Profile extends Component {
  render() {
    return (
      <ul id="profile">
        <li style={rowStyles}>
          <label style={labelStyles}>Username:</label>
          <input
            style={inputStyles}
            type="text"
            name="username"
            value={this.props.username}
          />
        </li>
        <li style={rowStyles}>
          <label style={labelStyles}>Seat of Power:</label>
          <input
            style={inputStyles}
            type="text"
            name="seat_of_power"
            value={this.props.seat_of_power}
          />
        </li>
        <li style={rowStyles}>
          <label style={labelStyles}>Family Words:</label>
          <input
            style={inputStyles}
            type="text"
            name="family_words"
            value={this.props.family_words}
          />
        </li>
      </ul>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  username: state.username,
  seat_of_power: state.seat_of_power,
  family_words: state.family_words,
  ws: state.ws,
});

const ProfileContainer = connect(mapStateToProps)(Profile);

export default ProfileContainer;
