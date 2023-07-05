import { useEffect, useState } from 'react';

import type { Participant } from '~API/types';
import { useCommunicationChannel } from '~applications/Context';
import { Channel, type OpenModalMessage } from '~communication-channel';
import type { ParticipantsChangeMessage } from '~communication-channel';

import { useModal } from './useModal';

interface ModalProps {
  opened?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ opened = false }) => {
  const channel = useCommunicationChannel();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [message, setMessage] = useState<string>('Lorem ipsum');
  const [modalRef, showModal, setShowModal, modalStyle] = useModal(opened);

  useEffect(() => {
    return () => setLoading(true);
  }, []);

  useEffect(() => {
    const unsubscribeFromModalChannel =
      channel.subscribeToChannel<OpenModalMessage>(Channel.MODAL, () => {
        setShowModal(true);
      });

    const unsubscribeFromParticipantsChannel =
      channel.subscribeToChannel<ParticipantsChangeMessage>(
        Channel.PARTICIPANTS_CHANGE,
        ({ participants }) => {
          setParticipants(participants);
        },
      );

    return () => {
      unsubscribeFromModalChannel();
      unsubscribeFromParticipantsChannel();
    };
  }, [channel, setShowModal, setParticipants]);

  useEffect(() => {
    setLoading(false);
    setMessage('Lorem ipsum');
  }, [participants, setLoading, setMessage]);

  if (!showModal) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="absolute flex justify-center items-center w-96 h-44 bg-green-100 border-green-400 border-solid border-x border-y"
      style={modalStyle}>
      {loading ? (
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded-sm dark:bg-green-700 w-48 mb-4"></div>
        </div>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};
