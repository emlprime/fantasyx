import React, {Component} from "react";
import ProfileForm from "./ProfileForm";
import {connect} from "react-redux";
class Profile extends Component {
  submit = data => {
    console.log("data:", data);
    const msg = JSON.stringify({
      type: "update_user",
      user_identifier: this.props.user_identifier,
      data: data,
    });
    this.props.ws.send(msg);
  };

  render() {
    return <ProfileForm onSubmit={this.submit} />;
  }
}

const mapStateToProps = state => {
  return {
    ws: state.data.ws,
  };
};

Profile = connect(mapStateToProps)(Profile);

export default Profile;
