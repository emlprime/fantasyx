import React, {Component} from "react";
import {connect} from "react-redux";
import {initialize, handleSubmit} from "redux-form";
import {Field, reduxForm} from "redux-form";
import {updateUser} from "../actions";
import Button from "./Button";

const rowStyles = {
  width: "100%",
  height: "3em",
  marginBottom: "2.5em",
};

const labelStyles = {
  width: "100%",
  textSize: "3em",
  fontWeight: "bold",
};

const inputStyles = {
  width: "100%",
  fontSize: "2em",
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.changeForm(this.props.user_data);
  }

  handleSubmit(user_data) {
    this.props.updateUser(user_data);
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div style={rowStyles}>
          <label htmlFor="username" style={labelStyles}>
            Username:
          </label>
          <Field
            name="username"
            component="input"
            type="text"
            style={inputStyles}
          />
        </div>
        <div style={rowStyles}>
          <label htmlFor="seat_of_power" style={labelStyles}>
            Seat of Power:
          </label>
          <Field
            name="seat_of_power"
            component="input"
            type="text"
            style={inputStyles}
          />
        </div>
        <div style={rowStyles}>
          <label htmlFor="house_words" style={labelStyles}>
            House Words:
          </label>
          <Field
            name="house_words"
            component="input"
            type="text"
            style={inputStyles}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  user_data: {
    username: state.user.username,
    seat_of_power: state.user.seat_of_power,
    house_words: state.user.house_words,
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateUser: data => {
    dispatch(updateUser(data));
  },
  changeForm: data => {
    dispatch(initialize("profile", data));
  },
});

Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

Profile = reduxForm({
  form: "profile",
})(Profile);

export default Profile;
