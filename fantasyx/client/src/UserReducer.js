import {removeNotification} from "./actions";

const reducer = (state = {}, action) => {
  let notifications = [];
  console.log("handing action:", action.type);
  /* console.log("action:", action);*/
  switch (action.type) {
    case "USER_IDENTIFIER":
      return {...state, user_identifier: action.user_identifier};
    case "SEND_USER_IDENTIFIER":
      console.log("ready to send user identifier");
      console.log(state.ws);
      console.log(state.user_identifier);
      state.ws.send(
        JSON.stringify({
          type: "USER_IDENTIFIER",
          user_identifier: state.user_identifier,
        }),
      );
      return {...state, user_identifier: action.user_identifier};
    case "LOGGED_OUT":
      return {};
    case "RELEASE":
      console.log("send relase to server");
      return state;
    case "USER_DATA":
      return {
        ...state,
        email: action.user_data.email,
        username: action.user_data.username,
        seat_of_power: action.user_data.seat_of_power,
        HOUSE_words: action.user_data.house_words,
      };
    case "RUBRIC":
      return {...state, rubric: action.rubric};
    case "CHARACTERS":
      const my_drafts = action.characters.filter(character => {
        return character.user === state.username;
      });

      return {...state, my_drafts: my_drafts};
    case "NOTIFY":
      console.log("notifying:", action.message);
      notifications = [
        ...state.notifications,
        {
          message: action.message,
          key: `Notify_${state.notifications.length + 1}`,
          dismissAfter: 2000,
          action: "dismiss",
          onClick: (notification, deactivate) => {
            deactivate();
            removeNotification("Notify");
          },
        },
      ];
      return {...state, notifications};
    case "REMOVE_NOTIFICATION":
      // console.log("removing notification");
      if (state.notifications) {
        notifications = state.notifications.filter(
          notification => notification.key !== action.key,
        );
      }
      return {...state, notifications};
    case "CAN_DRAFT":
      // console.log("got can draft", state.notifications.length,state.can_draft, action.can_draft);
      if (action.can_draft !== state.can_draft && action.can_draft) {
        notifications = [
          ...state.notifications,
          {
            message: `It is your turn to draft!`,
            key: `DraftNotice_${state.notifications.length + 1}`,
            dismissAfter: 2000,
            action: "dismiss",
            onClick: (notification, deactivate) => {
              deactivate();
              removeNotification("DraftNotice");
            },
          },
        ];
      } else {
        notifications = [...state.notifications];
      }
      return {...state, can_draft: action.can_draft, notifications};
    case "CONNECT_WEBSOCKET":
      return {...state, ws: action.ws};
    default:
      return state;
  }
};
export default reducer;
