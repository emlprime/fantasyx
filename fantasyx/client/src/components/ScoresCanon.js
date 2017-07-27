import BaseScores from "./BaseScores";
import {connect} from "react-redux";

class ScoresCharacterCanon extends BaseScores {
  defaultState() {
    return {
      canon: "canon",
      label: "Character",
      dataKey: "character_name",
    };
  }
}

const mapStateToProps = (state, ownProps) => ({
  report: state.data.raw_scores.raw_scores_canon_report,
  ws: state.data.ws,
});

const ScoresCharacterCanonContainer = connect(mapStateToProps)(
  ScoresCharacterCanon,
);

export default ScoresCharacterCanonContainer;
