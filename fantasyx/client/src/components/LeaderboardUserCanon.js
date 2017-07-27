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
  report: state.data.scores.user_canon_report,
  ws: state.data.ws,
});

const LeaderboardUserCanonContainer = connect(mapStateToProps)(
  LeaderboardUserCanon,
);

export default LeaderboardUserCanonContainer;
