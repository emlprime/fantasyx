import React from "react";
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

let ProfileForm = props => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <Field name="username" component="input" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

ProfileForm = reduxForm({
  form: "profile",
})(ProfileForm);

export default ProfileForm;
