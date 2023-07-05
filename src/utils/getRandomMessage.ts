import type { Participant } from '~API/types';

export function getRandomMessage(messages: string[]): string {
  const messagesLength = messages.length;
  const randomIndex = Math.floor(Math.random() * messagesLength);

  return messages[randomIndex];
}
