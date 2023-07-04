export type Participant = {
  name: string;
  url: string;
  messages: string[];
};

export type ParticipantsResponse = {
  record: {
    websites: Participant[];
  };
};
