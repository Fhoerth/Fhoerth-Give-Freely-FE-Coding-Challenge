import { useCallback, useEffect, useState } from 'react';

import type { Participant } from '~API/types';
import { useCommunicationChannel } from '~applications/common/Context';
import { Channel } from '~communication-channel/enums';
import type {
  OpenModalMessage,
  ParticipantsChangeMessage,
} from '~communication-channel/types';
import { getRandomElement } from '~utils/getRandomElement';

import { useModal } from './useModal';

interface ModalProps {
  opened?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ opened = false }) => {
  const channel = useCommunicationChannel();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
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

  const displaySkeleton = loading || !message || !participantName;

  return (
    <div
      ref={modalRef}
      className="absolute flex justify-center items-center w-96 bg-green-100 border-green-400 border-solid border-x border-y"
      style={modalStyle}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-green-200">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-green-600">
            {displaySkeleton ? (
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-10 bg-gray-200 rounded-sm dark:bg-green-700 w-48"></div>
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-green-950">
                {participantName}
              </h3>
            )}
            <button
              type="button"
              className="text-green-600 bg-transparent hover:bg-green-600 hover:text-green-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              onClick={handleModalClose}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            {displaySkeleton ? (
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded-sm dark:bg-green-700 w-48"></div>
              </div>
            ) : (
              <p className="text-base leading-relaxed text-green-800">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
