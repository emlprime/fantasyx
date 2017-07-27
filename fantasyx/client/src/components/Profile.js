import React from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";

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

let Profile = props => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div style={rowStyles}>
        <label htmlFor="username" style={labelStyles}>
          Username
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
          Seat Of Power
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
          House Words
        </label>
        <Field
          name="house_words"
          component="input"
          type="email"
          style={inputStyles}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
};

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
Profile = reduxForm({
  form: "initializeFromState", // a unique identifier for this form
})(Profile);

const loadAccount = () => {
  return {};
};

// You have to connect() to any reducers that you wish to connect to yourself
Profile = connect(
  state => ({
    initialValues: state.user_data, // pull initial values from account reducer
  }),
  {load: loadAccount}, // bind account loading action creator
)(Profile);

export default Profile;
