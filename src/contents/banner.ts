import type { PlasmoCSConfig } from 'plasmo';

import type { Participant } from '~API/types';
import { renderBanner } from '~applications';
import { Client, ContentCommunicationChannel } from '~communication-channel';
import { onDomContentLoaded } from '~contents-utils/onDomContentLoaded';
import { createParticipantsRegExp } from '~utils/createParticipantsRegExp';
import { getDomain } from '~utils/getDomain';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

function maybeGetFirstParticipant(
  participants: Participant[],
): Participant | null {
  const origin = window.location.origin;
  const participantsRegExp = createParticipantsRegExp(participants);
  const [firstMatch] = participantsRegExp.exec(origin) || [];

  if (firstMatch) {
    const maybeParticipant = participants.find(
      (participant) => getDomain(participant.url) === getDomain(firstMatch),
    );

    return maybeParticipant || null;
  }

  return null;
}

async function domContentLoaded(): Promise<void> {
  try {
    const channel = new ContentCommunicationChannel(Client.BELL);

    await channel.initialize();

    const fetchParticipantsResponse = await channel.fetchParticipants();

    if (!fetchParticipantsResponse.success) {
      throw new Error(fetchParticipantsResponse.message);
    }

    const participants = fetchParticipantsResponse.payload;
    const maybeFirstParticipant = maybeGetFirstParticipant(participants);

    if (maybeFirstParticipant) {
      const participant = maybeFirstParticipant;
      renderBanner(participant);

      window.addEventListener('locationchange', () => {
        renderBanner(participant);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();
