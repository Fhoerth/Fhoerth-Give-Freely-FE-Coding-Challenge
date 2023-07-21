import { useCallback, useEffect, useState } from 'react';

import type { Participant } from '~API/types';
import { useCommunicationChannel } from '~applications/common/Context';
import { BroadcastChannel } from '~communication-channel/enums';
import type {
  OpenModalMessage,
  ParticipantsChangeMessage,
} from '~communication-channel/types';
import { getRandomElement } from '~utils/getRandomElement';

import { Modal } from '../common/components/Modal';

interface ModalProps {
  opened?: boolean;
}

export const GoogleModal: React.FC<ModalProps> = ({ opened = false }) => {
  const channel = useCommunicationChannel();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(opened);

  useEffect(() => {
    return () => setLoading(true);
  }, []);

  useEffect(() => {
    const unsubscribeFromModalChannel =
      channel.subscribeToChannel<OpenModalMessage>(
        BroadcastChannel.MODAL,
        () => {
          setShowModal(true);
        },
      );

    const unsubscribeFromParticipantsChannel =
      channel.subscribeToChannel<ParticipantsChangeMessage>(
        BroadcastChannel.PARTICIPANTS_CHANGE,
        ({ participants }) => {
          setParticipants(participants);
        },
      );

    return () => {
      unsubscribeFromModalChannel();
      unsubscribeFromParticipantsChannel();
    };
  }, [channel, setShowModal, setParticipants]);

  useEffect((): void => {
    if (!showModal) {
      return;
    }

    const randomParticipant = getRandomElement(participants);
    const randomMessage = getRandomElement(randomParticipant.messages);

    setParticipantName(randomParticipant.name);
    setMessage(randomMessage);
    setLoading(false);
  }, [showModal, participants, setLoading, setMessage]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  if (!showModal) {
    return null;
  }

  const baseProps = { onModalClose: handleModalClose };
  const isModalOpened = showModal && participantName && message && !loading;
  const props = isModalOpened
    ? ({
        ...baseProps,
        opened: true,
        loading: false,
        title: participantName,
        content: 'World',
      } as const)
    : ({ ...baseProps, opened: false, loading: true } as const);

  return <Modal {...props} />;
};
