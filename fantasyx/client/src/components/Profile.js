import React, {Component} from "react";
import ProfileForm from "./ProfileForm";

class Profile extends Component {
  submit = values => {
    console.log(values);
  };

  render() {
    return <ProfileForm onSubmit={this.submit} />;
  }
}

export default Profile;
