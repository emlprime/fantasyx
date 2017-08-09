import IntroductionMessage from "./stub_messages/introduction_stub.json";

const GameReducer = (state = {}, action) => {
  /* console.log(`handling action ${action.type}`);*/
  switch (action.type) {
    case "RUBRIC":
      const introduction = IntroductionMessage.introduction;
      return {...state, rubric: action.rubric, introduction};
    case "CHARACTERS":
      const available_characters = action.characters.filter(character => {
        return character.user === null;
      });
      return {...state, characters: action.characters, available_characters};
    default:
      return state;
  }
};

export default GameReducer;
