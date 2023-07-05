import type { Participant } from '~API/types';

import { getDomain } from './getDomain';

function createParticipantPattern(participant: Participant): string {
  const domain = getDomain(participant.url);
  return `^(https?://[a-zA-Z0-9-_]*)?\.?(${domain}).*`;
}

export function createParticipantsRegExp(participants: Participant[]): RegExp {
  const pattern = participants
    .map(createParticipantPattern)
    .map((pattern) => `(${pattern})`)
    .join('|');
  const regExp = new RegExp(pattern, 'i');

  return regExp;
}
