import React, {Component} from "react";
import {change} from "redux-form";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
/* const rowStyles = {
 *   width: "100%",
 *   height: "3em",
 *   marginBottom: "1.5em",
 * };
 * 
 * const labelStyles = {
 *   width: "100%",
 *   textSize: "3em",
 * };
 * 
 * const inputStyles = {
 *   width: "100%",
 *   height: "3em",
 * };
 * 
 * const user_data = {
 *   email: "foo",
 *   username: "bar",
 *   seat_of_power: "asdf",
 *   house_words: "sdfdfds",
 * };*/

class ProfileForm extends Component {
  render() {
    const {handleSubmit, changeForm} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <button type="button" onClick={changeForm}>
            Load Profile
          </button>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <Field name="username" component="input" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    changeForm: () => {
      console.log("foo");
      dispatch(change("profile", "username", "foo"));
    },
  };
}

ProfileForm = connect(null, mapDispatchToProps)(ProfileForm);

ProfileForm = reduxForm({
  form: "profile",
})(ProfileForm);

export default ProfileForm;
