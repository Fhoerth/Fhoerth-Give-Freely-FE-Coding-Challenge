import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

export function useModal(
  opened: boolean,
): [RefObject<HTMLDivElement>, boolean, CSSProperties] {
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

  return [modalRef, showModal, modalStyle];
}
