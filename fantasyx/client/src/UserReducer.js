import {removeNotification} from "./actions";

const reducer = (state = {}, action) => {
  let notifications = [];
  /* console.log("action:", action);
   * console.log("handling action:", action.type);*/
  switch (action.type) {
    case "USER_IDENTIFIER":
      return {...state, user_identifier: action.user_identifier};
    case "UPDATE_USER":
      state.ws.send(JSON.stringify(action));
      return {...state, ...action.data};
    case "DRAFT":
      const data = action.data;
      data.user_identifier = state.user_identifier;
      const message = {
        type: "DRAFT",
        data,
      };
      state.ws.send(JSON.stringify(message));

      return {...state};
    case "SEND_USER_IDENTIFIER":
      state.ws.send(
        JSON.stringify({
          type: "USER_IDENTIFIER",
          user_identifier: state.user_identifier,
        }),
      );
      return {...state, user_identifier: state.user_identifier};
    case "LOGGED_OUT":
      return {};
    case "RELEASE":
      let msg = action;
      msg.data["user_identifier"] = state.user_identifier;
      state.ws.send(JSON.stringify(msg));
      return state;
    case "USER_DATA":
      return {
        ...state,
        email: action.user_data.email,
        username: action.user_data.username,
        seat_of_power: action.user_data.seat_of_power,
        house_words: action.user_data.house_words,
      };
    case "RUBRIC":
      return {...state, rubric: action.rubric};
    case "CHARACTERS":
      const my_drafts = action.characters.filter(character => {
        return character.user === state.username;
      });

      return {...state, my_drafts: my_drafts};
    case "NOTIFY":
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
            message: `You can draft if you want to!`,
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
    case "CAN_RELEASE":
      return {...state, can_release: action.can_release};
    case "CONNECT_WEBSOCKET":
      return {...state, ws: action.ws};
    default:
      return state;
  }
};
export default reducer;
