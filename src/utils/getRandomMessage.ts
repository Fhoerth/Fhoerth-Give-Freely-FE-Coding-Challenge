import type { Participant } from '~API/types';

export function getRandomMessage(participant: Participant): string {
  const { messages } = participant;
  const messagesLength = messages.length;
  const randomIndex = Math.floor(Math.random() * messagesLength);

  return messages[randomIndex];
}
