import type { Participant } from '~API/types';

import { createParticipantsRegExp } from './createParticipantsRegExp';

function createMatcher(participants: Participant[]) {
  const regExp = createParticipantsRegExp(participants);
  const predicate = (anchorElement: HTMLAnchorElement): boolean =>
    !!regExp.exec(anchorElement.href);

  return predicate;
}

function findClosestElementToBeHighlighted(
  anchorElement: HTMLAnchorElement,
): Element {
  const maybeAd = anchorElement.closest('div[data-text-ad]');

  if (maybeAd) {
    return maybeAd;
  }

  const maybeDataOlHasClickHandler = anchorElement.closest(
    '[data-ol-has-click-handler]',
  );

  if (maybeDataOlHasClickHandler) {
    const maybeDataOlHasClickHandlerParent = maybeDataOlHasClickHandler.closest(
      '[data-ol-has-click-handler]',
    );

    if (maybeDataOlHasClickHandlerParent) {
      return maybeDataOlHasClickHandlerParent;
    }

    return maybeDataOlHasClickHandler;
  }

  const maybeDataSnc = anchorElement.closest('[data-snc]');

  if (maybeDataSnc) {
    return maybeDataSnc;
  }

  const maybeParentElement = anchorElement.parentElement;

  if (maybeParentElement) {
    const div = document.createElement('div');

    maybeParentElement.replaceChild(div, anchorElement);
    div.appendChild(anchorElement);

    return div;
  }

  return anchorElement;
}

export function getParticipantElementsToBeHighlighted(
  participants: Participant[],
): Element[] {
  const anchorElements = document.querySelectorAll('a');
  const matcher = createMatcher(participants);
  const participantAnchorElements = Array.from(anchorElements)
    .filter(matcher)
    .map(findClosestElementToBeHighlighted);

  return participantAnchorElements;
}
