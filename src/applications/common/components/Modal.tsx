import type { ReactElement } from 'react';

import { useModal } from './useModal';

type ModalProps =
  | {
      opened: false;
      loading: true;
      onModalClose: () => void;
    }
  | {
      title: string;
      content: string | ReactElement;
      opened: true;
      loading: false;
      onModalClose: () => void;
    };

export const Modal: React.FC<ModalProps> = (props) => {
  const { opened, loading, onModalClose } = props;
  const [modalRef, modalStyle] = useModal(opened);

  if (!opened) {
    return null;
  }

  if (loading) {
    return (
      <div
        ref={modalRef}
        className="absolute flex justify-center items-center w-96 bg-green-100 border-green-400 border-solid border-x border-y"
        style={modalStyle}>
        <div className="relative w-full max-w-2xl max-h-full">
          <div className="relative bg-green-200">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-green-600">
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-10 bg-gray-200 rounded-sm dark:bg-green-700 w-48"></div>
              </div>
              <button
                type="button"
                className="text-green-600 bg-transparent hover:bg-green-600 hover:text-green-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                onClick={onModalClose}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded-sm dark:bg-green-700 w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { title, content } = props;

  return (
    <div
      ref={modalRef}
      className="absolute flex justify-center items-center w-96 bg-green-100 border-green-400 border-solid border-x border-y"
      style={modalStyle}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-green-200">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-green-600">
            <h3 className="text-xl font-semibold text-green-950">{title}</h3>
            <button
              type="button"
              className="text-green-600 bg-transparent hover:bg-green-600 hover:text-green-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              onClick={onModalClose}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-base leading-relaxed text-green-800">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
