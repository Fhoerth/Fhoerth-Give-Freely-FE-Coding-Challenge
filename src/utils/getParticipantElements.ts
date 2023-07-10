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

  const participantsMap = new Map<string, Participant>(
    participants.map((participant) => [
      getDomain(participant.url),
      participant,
    ]),
  );
  const participantsRegExp = createParticipantsRegExp(participants);
  const anchorElementMatches = anchorElements.reduce(
    (result, anchorElement) => {
      const match =
        getDomain(anchorElement.href).match(participantsRegExp) || [];
      result.push(...match);

      return result;
    },
    [] as string[],
  );
  const anchorElementMatchesSet = new Set(anchorElementMatches);
  const participantsInvolved: Participant[] = [];

  for (const match of anchorElementMatchesSet) {
    const maybeParticipant = participantsMap.get(match);

    if (maybeParticipant) {
      participantsInvolved.push(maybeParticipant);
    }
  }

  const closestElementsResult =
    participantAnchorElements.map(findClosestElement);

  return [participantsInvolved, closestElementsResult];
}
