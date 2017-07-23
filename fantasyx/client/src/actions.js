export const gotUserIdentifier = user_identifier => ({
  type: "USER_IDENTIFIER",
  user_identifier,
});

export const gotUserData = user_data => ({
  type: "USER_DATA",
  user_data,
});

export const gotCharacters = characters => ({
  type: "CHARACTERS",
  characters,
});

export const gotRubric = rubric => ({
  type: "RUBRIC",
  rubric,
});

export const gotAvailableCharacters = available_characters => ({
  type: "AVAILABLE_CHARACTERS",
  available_characters,
});

export const gotScores = scores => ({
  type: "SCORES",
  scores,
});

export const gotRawScores = raw_scores => ({
  type: "RAW_SCORES",
  raw_scores,
});

export const gotMyDrafts = my_drafts => ({
  type: "MY_DRAFTS",
  my_drafts,
});

export const gotCanDraft = can_draft => ({
  type: "CAN_DRAFT",
  can_draft,
});

export const loggedOut = () => ({
  type: "LOGGED_OUT",
});

export const removeNotification = key => ({
  type: "REMOVE_NOTIFICATION",
  key,
});
