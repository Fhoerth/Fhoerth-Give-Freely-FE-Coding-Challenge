import type { Participant } from '~API/types';

export function mergeMessages(participants: Participant[]): string[] {
  return participants.reduce((messages, participant) => {
    messages.push(...participant.messages);

    return messages;
  }, [] as string[]);
}
