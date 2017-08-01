import React, {Component} from "react";
import {initialize} from "redux-form";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
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

class ProfileForm extends Component {
  componentWillMount() {
    this.props.changeForm(this.props.user_data);
  }
  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user_data: {
      username: state.data.username,
      seat_of_power: state.data.seat_of_power,
      house_words: state.data.house_words,
    },
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    changeForm: data => {
      dispatch(initialize("profile", data));
    },
  };
}

ProfileForm = connect(mapStateToProps, mapDispatchToProps)(ProfileForm);

ProfileForm = reduxForm({
  form: "profile",
})(ProfileForm);

export default ProfileForm;
