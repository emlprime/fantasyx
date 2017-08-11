export const removeNotification = key => ({
  type: "REMOVE_NOTIFICATION",
  key,
});

export const updateUser = data => ({
  type: "UPDATE_USER",
  data,
});

export const handleDraft = data => ({
  type: "DRAFT",
  data,
});

export const handleRelease = data => ({
  type: "RELEASE",
  data,
});
