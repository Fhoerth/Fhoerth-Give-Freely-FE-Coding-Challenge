import { useCallback } from 'react';

import { useCommunicationChannel } from '~applications/Context';
import { Channel } from '~communication-channel';
import type { OpenModalMessage } from '~communication-channel';

export const Bell: React.FC = () => {
  const channel = useCommunicationChannel();

  const handleIconClick = useCallback((): void => {
    async function emitEvent() {
      try {
        await channel.broadcast<OpenModalMessage>(Channel.MODAL, {
          opened: true,
        });
      } catch (reason) {
        console.error(reason);
      }
    }

    void emitEvent();
  }, []);

  return (
    <div
      style={{
        width: '100px',
        height: '38px',
        background: 'red',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        position: 'relative',
        top: '4px',
      }}
      onClick={handleIconClick}>
      Bell
    </div>
  );
};
