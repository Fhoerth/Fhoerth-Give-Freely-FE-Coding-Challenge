export enum ChannelName {
  GOOGLE = 'GOOGLE',
  BANNER = 'BANNER',
  POPUP = 'POPUP',
}

export enum Client {
  BELL,
  SEARCH,
  MODAL,
  BANNER,
  BACKGROUND,
  POPUP,
}

export enum MessageType {
  PING,
  PONG,
  BROADCAST_REQUEST,
  BROADCAST_RESPONSE,
  FETCH_PARTICIPANTS_REQUEST,
  FETCH_PARTICIPANTS_RESPONSE,
  BROADCAST_MESSAGE,
  OPEN_MODAL_MESSAGE,
}

export enum Channel {
  PARTICIPANTS_CHANGE,
  MODAL,
}
