import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Contenedor del Modal: Fondo oscuro, borde 1.5px, padding 10px */}
      <div className="bg-slate-900 border-[1.5px] border-[#1E293B] rounded-xl p-2.5 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#d3e4fe]">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 pt-1 px-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-[#d3e4fe] transition-colors font-bold text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
