export function getRandomElement<T>(messages: T[]): T {
  const messagesLength = messages.length;
  const randomIndex = Math.floor(Math.random() * messagesLength);

  return messages[randomIndex];
}
