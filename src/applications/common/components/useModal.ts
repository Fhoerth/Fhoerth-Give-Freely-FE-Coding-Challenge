import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react';

/**
 *   boolean,
 *  Dispatch<SetStateAction<boolean>>,
 */

export function useModal(
  opened: boolean,
): [RefObject<HTMLDivElement>, CSSProperties] {
  const modalRef = useRef<HTMLDivElement>(null);

  const [modalStyle, setModalStyle] = useState<CSSProperties>({
    top: '-5000px',
    left: '-5000px',
  });

  const calculatePosition = useCallback(
    (htmlDivElement: HTMLDivElement): void => {
      const { innerWidth, innerHeight } = window;
      const { width } = htmlDivElement.getBoundingClientRect();

      const left = innerWidth / 2 - width / 2;
      const top = '50px';

      setModalStyle({ ...modalStyle, left, top });
    },
    [setModalStyle],
  );

  useEffect(() => {
    if (modalRef.current && opened) {
      calculatePosition(modalRef.current);
    }
  }, [opened, modalRef.current]);

  return [modalRef, modalStyle];
}
