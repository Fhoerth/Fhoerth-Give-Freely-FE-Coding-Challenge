import type { Participant } from '~API/types';

import { getDomain } from './getDomain';

export function createParticipantsRegExp(participants: Participant[]): RegExp {
  const domains = participants.map((participant) => getDomain(participant.url));
  const patterns = domains.map(
    (domain) => `(^https?://[a-zA-Z0-9-_]*\.?${domain}.*)`,
  );
  const regExp = new RegExp(patterns.join('|'), 'i');

  return regExp;
}
