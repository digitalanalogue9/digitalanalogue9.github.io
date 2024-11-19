import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps } from '@/components/common/Modal/types';


export function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'max-w-lg' 
  }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);
  
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleOverlayClick}
            />
  
            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  ref={modalRef}
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWidth}`}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                          {title}
                        </h3>
                        <div className="mt-2">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }