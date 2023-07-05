import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { useModal } from './useModal';

interface ModalProps {
  opened?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ opened = false }) => {
  const [modalRef, showModal, modalStyle] = useModal(opened);

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
