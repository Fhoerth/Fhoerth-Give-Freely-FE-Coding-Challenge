import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react';

export function useModal(
  opened: boolean,
): [
  RefObject<HTMLDivElement>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
  CSSProperties,
] {
  const modalRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState<boolean>(opened);
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
    if (modalRef.current && showModal) {
      calculatePosition(modalRef.current);
    }
  }, [setShowModal, showModal, modalRef.current]);

  return [modalRef, showModal, setShowModal, modalStyle];
}
