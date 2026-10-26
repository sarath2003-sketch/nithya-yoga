import React, { useState } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup
} from 'motion/react';
import { X, Fingerprint } from 'lucide-react';

const springTransition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
};

export const FamilyReceiveComponent = ({
  triggerLabel = 'Receive',
  title = 'Confirm',
  description = 'Are you sure you want to proceed with this yoga session?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  icon,
  accentColor = '#7C3AED',
  className = '',
  buttonWidth = 'w-64 md:w-96',
  fullWidth = false,
  triggerClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeColor = accentColor || '#7C3AED';

  return (
    <div className={`relative flex min-h-[160px] max-w-full items-center justify-center ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      <LayoutGroup>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="trigger"
              layoutId="action-button"
              onClick={() => setIsOpen(true)}
              style={{ background: activeColor }}
              className={`relative h-12 ${buttonWidth} cursor-pointer rounded-full text-base font-semibold text-white shadow-xl transition-all hover:opacity-95 md:h-14 md:text-lg flex items-center justify-center gap-2 ${triggerClassName}`}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={springTransition}
            >
              {icon && <span className="flex items-center">{icon}</span>}
              <span>{triggerLabel}</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
              }}
            >
              <motion.div
                initial={{ y: 80, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 80, opacity: 0, scale: 0.96 }}
                transition={springTransition}
                className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-violet-500/20 bg-[#16102E] p-6 text-white shadow-2xl md:rounded-[32px] md:p-7"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>

                <div className="mb-4 flex items-center gap-3.5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400"
                    style={{ color: activeColor }}
                  >
                    {icon ?? (
                      <Fingerprint size={24} style={{ color: activeColor }} />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white md:text-2xl tracking-tight">
                    {title}
                  </h2>
                </div>

                <p className="my-4 text-base font-medium text-purple-200/80 leading-relaxed md:my-5">
                  {description}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="h-12 flex-1 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-purple-200 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    {cancelLabel}
                  </button>

                  <motion.button
                    layoutId="action-button"
                    style={{ background: activeColor }}
                    onClick={() => {
                      onConfirm?.();
                      setIsOpen(false);
                    }}
                    className="h-12 flex-1 cursor-pointer rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:opacity-95"
                    transition={springTransition}
                  >
                    {confirmLabel}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};

export default FamilyReceiveComponent;
