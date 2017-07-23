import BaseLeaderboard from "./BaseLeaderboard";
import {connect} from "react-redux";

class LeaderboardUserCanon extends BaseLeaderboard {
  defaultState() {
    return {
      pivot: "user",
      canon: "canon",
      label: "User",
      dataKey: "user_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.scores.user_canon_report,
  ws: state.ws,
});

const LeaderboardUserCanonContainer = connect(mapStateToProps)(
  LeaderboardUserCanon,
);

export default LeaderboardUserCanonContainer;
