import type { PlasmoCSConfig } from 'plasmo';

import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import {
  BroadcastChannel,
  ChannelId,
  Client,
} from '~communication-channel/enums';
import type { ParticipantsChangeMessage } from '~communication-channel/types';
import { getParticipantElements } from '~utils/getParticipantElements';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.google.com/search*', 'https://*.google.com.ar/search*'],
};

const applyMatchedElementStyle = (element: Element): void => {
  if (element instanceof HTMLElement) {
    element.style.border = '1px solid red';
  }
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelId: ChannelId.GOOGLE,
    client: Client.SEARCH,
    clients: [Client.BELL, Client.SEARCH, Client.GOOGLE_MODAL],
  });

  await channel.initialize();

  const { payload: participants } = await channel.fetchParticipants();
  const [matchedParticipants, matchedElements] =
    getParticipantElements(participants);

  matchedElements.forEach(applyMatchedElementStyle);

  await channel.broadcast<ParticipantsChangeMessage>(
    BroadcastChannel.PARTICIPANTS_CHANGE,
    { participants: matchedParticipants },
  );
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();
