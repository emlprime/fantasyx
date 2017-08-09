import React, {Component} from "react";
import {connect} from "react-redux";
import Content from "./Content";
import Rubric from "./Rubric";

class Home extends Component {
  render() {
    return (
      <div>
        <Content rows={this.props.introduction} />
        <Rubric sections={this.props.rubric_sections} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    introduction: state.game.introduction,
    rubric_sections: state.game.rubric,
  };
};

Home = connect(mapStateToProps)(Home);

export default Home;
