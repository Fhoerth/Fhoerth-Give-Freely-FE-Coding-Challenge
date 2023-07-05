import { useEffect, useState } from 'react';

import { useCommunicationChannel } from '~applications/Context';
import { Channel } from '~communication-channel';
import type { ParticipantsChangeMessage } from '~communication-channel';

import { useModal } from './useModal';

interface ModalProps {
  opened?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ opened = false }) => {
  const channel = useCommunicationChannel();
  const [modalRef, showModal, setShowModal, modalStyle] = useModal(opened);

  useEffect(() => {
    const unsubscribeToModalChannel =
      channel.subscribeToChannel<ParticipantsChangeMessage>(
        Channel.MODAL,
        () => {
          alert('Show Modal!');
        },
      );

    return () => {
      unsubscribeToModalChannel();
    };
  }, [setShowModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="absolute flex justify-center items-center w-96 h-44 bg-green-100 border-green-400 border-solid border-x border-y"
      style={modalStyle}>
      Lorem ipsum dolor sit amet
    </div>
  );
};
