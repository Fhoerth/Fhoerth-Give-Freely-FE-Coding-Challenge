export enum ChannelId {
  SEARCH = 'SEARCH',
  BANNER = 'BANNER',
  BELL = 'BELL',
  GOOGLE_MODAL = 'GOOGLE_MODAL',
  GLOBAL_MODAL = 'GLOBAL_MODAL',
  POPUP = 'POPUP',
}

export enum Client {
  BELL,
  SEARCH,
  GOOGLE_MODAL,
  GLOBAL_MODAL,
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
  OPEN_EXTERNAL_LINK
}

export enum BroadcastChannel {
  PARTICIPANTS_CHANGE,
  MODAL,
}
