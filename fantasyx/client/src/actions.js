export const removeNotification = key => ({
  type: "REMOVE_NOTIFICATION",
  key,
});

export const updateUser = data => ({
  type: "UPDATE_USER",
  data,
});
