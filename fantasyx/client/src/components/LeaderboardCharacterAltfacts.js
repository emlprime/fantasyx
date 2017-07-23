import BaseLeaderboard from "./BaseLeaderboard";
import {connect} from "react-redux";

class LeaderboardCharacterAltfacts extends BaseLeaderboard {
  defaultState() {
    return {
      pivot: "character",
      canon: "altfacts",
      label: "Character",
      dataKey: "character_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.scores.character_altfacts_report,
  ws: state.ws,
});

const LeaderboardCharacterAltfactsContainer = connect(mapStateToProps)(
  LeaderboardCharacterAltfacts,
);

export default LeaderboardCharacterAltfactsContainer;
