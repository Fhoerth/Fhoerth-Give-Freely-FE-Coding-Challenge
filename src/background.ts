import { BackgroundCommunicationChannel } from '~communication-channel';

export {};

async function main() {
  const channel = new BackgroundCommunicationChannel();
  channel.initialize();
}

void main().catch((error) => {
  console.error(error);
});
