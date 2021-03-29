import React, { useState, useEffect } from 'react';

import ReactModal from 'react-modal';

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

interface IState {
  modalStatus: boolean;
}

const Modal: React.FC<IModalProps> = ({ isOpen, setIsOpen, children }) => {

  const [state, setState] = useState<IState>({
    modalStatus: isOpen
  });

  useEffect(() => {
    setState({ modalStatus: isOpen })
  }, [isOpen])
  
  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={state.modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {children}
    </ReactModal>
  );
  
};

export default Modal;
