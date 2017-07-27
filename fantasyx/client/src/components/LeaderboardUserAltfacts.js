import BaseLeaderboard from "./BaseLeaderboard";
import {connect} from "react-redux";

class LeaderboardUserAltfacts extends BaseLeaderboard {
  defaultState() {
    return {
      pivot: "user",
      canon: "altfacts",
      label: "User",
      dataKey: "user_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.data.scores.user_altfacts_report,
  ws: state.data.ws,
});

const LeaderboardUserAltfactsContainer = connect(mapStateToProps)(
  LeaderboardUserAltfacts,
);

export default LeaderboardUserAltfactsContainer;
