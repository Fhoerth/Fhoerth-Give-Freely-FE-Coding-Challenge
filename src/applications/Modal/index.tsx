import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface ModalProps {
  opened?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ opened = false }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalStyle, setModalStyle] = useState<CSSProperties>({
    top: '-500px',
    left: '-500px',
  });

  const calculatePosition = useCallback(
    (htmlDivElement: HTMLDivElement): void => {
      const { innerWidth, innerHeight } = window;
      const { width, height } = htmlDivElement.getBoundingClientRect();

      const left = innerWidth / 2 - width / 2;
      const top = innerHeight / 2 - height / 2;

      setModalStyle({ ...modalStyle, left, top });
    },
    [setModalStyle],
  );

  useEffect(() => {
    setShowModal(opened);

    if (modalRef.current && showModal) {
      calculatePosition(modalRef.current);
    }
  }, [opened, setShowModal, showModal, modalRef.current]);

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
