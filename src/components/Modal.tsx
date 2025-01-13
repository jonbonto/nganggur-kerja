import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
