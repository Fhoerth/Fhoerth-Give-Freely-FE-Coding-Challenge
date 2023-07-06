import { useCallback, useEffect, useState } from 'react';

import { useCommunicationChannel } from '~applications/common/Context';
import { BroadcastChannel } from '~communication-channel/enums';
import type {
  OpenModalMessage,
  ParticipantsChangeMessage,
} from '~communication-channel/types';

export const Bell: React.FC = () => {
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const channel = useCommunicationChannel();

  useEffect(() => {
    const unsubscribeFromParticipantsChannel =
      channel.subscribeToChannel<ParticipantsChangeMessage>(
        BroadcastChannel.PARTICIPANTS_CHANGE,
        ({ participants }) => {
          setShowIcon(!!participants.length);
        },
      );

    return unsubscribeFromParticipantsChannel;
  }, [channel]);

  const handleIconClick = useCallback((): void => {
    async function emitEvent() {
      try {
        await channel.broadcast<OpenModalMessage>(BroadcastChannel.MODAL, {
          opened: true,
        });
      } catch (reason) {
        console.error(reason);
      }
    }

    void emitEvent();
  }, []);

  if (!showIcon) {
    return null;
  }

  return (
    <div className="flex">
      <div className="giveFreely__image" />
      <div className="giveFreely__bell-icon" onClick={handleIconClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
