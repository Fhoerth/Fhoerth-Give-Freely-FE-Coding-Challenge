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

  return (
    <Modal
      opened={true}
      loading={false}
      title="Trip Advisor"
      content={<a href="#">Open link in a new tab</a>}
      onModalClose={handleModalClose}
    />
  );
};
