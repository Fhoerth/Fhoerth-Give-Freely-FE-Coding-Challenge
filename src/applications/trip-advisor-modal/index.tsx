import { useCallback, useEffect, useState } from 'react';

import { Modal } from '../common/components/Modal';

interface ModalProps {
  opened?: boolean;
}

export const GlobalModal: React.FC<ModalProps> = ({ opened = false }) => {
  const [showModal, setShowModal] = useState<boolean>(opened);

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
        content: <a href="#">Open link in a new tab</a>,
      } as const)
    : ({ ...baseProps, opened: false, loading: true } as const);

  return <Modal {...props} />;
};
