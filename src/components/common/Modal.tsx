import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-cozy-lg bg-white p-6 shadow-cozy-lg">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-semibold text-cozy-text-primary">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-cozy-text-secondary hover:text-cozy-text-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
