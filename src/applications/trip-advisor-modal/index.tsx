import { useCallback, useEffect, useState } from 'react';

import { MessageType } from '~communication-channel/enums';
import type {
  OpenExternalLinkRequest,
  OpenExternalLinkResponse,
} from '~communication-channel/types';

import { useCommunicationChannel } from '../common/Context';
import { Modal } from '../common/components/Modal';

interface ModalProps {
  opened?: boolean;
}

export const GlobalModal: React.FC<ModalProps> = ({ opened = false }) => {
  const channel = useCommunicationChannel();
  const [showModal, setShowModal] = useState<boolean>(opened);

  const handleLinkClick = useCallback(() => {
    channel.sendToBackground<OpenExternalLinkRequest, OpenExternalLinkResponse>(
      {
        type: MessageType.OPEN_EXTERNAL_LINK,
        payload: {
          url: 'https://www.google.com',
        },
      },
    );
  }, [channel]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const baseProps = { onModalClose: handleModalClose };
  const isModalOpened = showModal;
  const props = isModalOpened
    ? ({
        ...baseProps,
        opened: true,
        loading: false,
        title: 'Trip Advisor',
        content: (
          <a href="#" onClick={handleLinkClick}>
            Open link in a new tab
          </a>
        ),
      } as const)
    : ({ ...baseProps, opened: false, loading: true } as const);

  return <Modal {...props} />;
};
