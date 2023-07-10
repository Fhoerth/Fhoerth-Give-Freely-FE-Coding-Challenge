export function getRandomElement<T>(elements: T[]): T {
  const elementsLength = elements.length;
  const randomIndex = Math.floor(Math.random() * elementsLength);

  return elements[randomIndex];
}
