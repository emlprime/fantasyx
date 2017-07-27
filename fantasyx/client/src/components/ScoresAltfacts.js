import BaseScores from "./BaseScores";
import {connect} from "react-redux";

class ScoresCharacterAltfacts extends BaseScores {
  defaultState() {
    return {
      canon: "altfacts",
      label: "Character",
      dataKey: "character_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.data.raw_scores.raw_scores_altfacts_report,
  ws: state.data.ws,
});

const ScoresCharacterAltfactsContainer = connect(mapStateToProps)(
  ScoresCharacterAltfacts,
);

export default ScoresCharacterAltfactsContainer;
