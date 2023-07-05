import type { Participant } from '~API/types';

import { createParticipantsRegExp } from './createParticipantsRegExp';
import { getDomain } from './getDomain';

function getHref(anchorElement: HTMLAnchorElement): string {
  return anchorElement.href;
}

function createMatcher(participants: Participant[]) {
  const regExp = createParticipantsRegExp(participants);
  const predicate = (anchorElement: HTMLAnchorElement): boolean =>
    !!regExp.exec(getHref(anchorElement));

  return predicate;
}

function findClosestElement(anchorElement: HTMLAnchorElement): Element {
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

export function getParticipantElements(
  participants: Participant[],
): [Participant[], Element[]] {
  const anchorElements = Array.from(document.querySelectorAll('a'));
  const matcher = createMatcher(participants);
  const participantAnchorElements = anchorElements.filter(matcher);

  const domains = new Set(
    participantAnchorElements.map(getHref).map(getDomain),
  );

  const participantsResult = participants.filter((participant) =>
    domains.has(getDomain(participant.url)),
  );

  const closestElementsResult =
    participantAnchorElements.map(findClosestElement);

  return [participantsResult, closestElementsResult];
}
