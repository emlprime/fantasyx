import BaseLeaderboard from "./BaseLeaderboard";
import {connect} from "react-redux";

class LeaderboardCharacterCanon extends BaseLeaderboard {
  defaultState() {
    return {
      pivot: "character",
      canon: "canon",
      label: "Character",
      dataKey: "character_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.data.scores.character_canon_report,
  ws: state.data.ws,
});

const LeaderboardCharacterCanonContainer = connect(mapStateToProps)(
  LeaderboardCharacterCanon,
);

export default LeaderboardCharacterCanonContainer;
