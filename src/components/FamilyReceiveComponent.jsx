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

  return (
    <div 
      className={`relative ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        minHeight: isOpen ? '260px' : '64px',
        margin: '8px 0',
        transition: 'min-height 0.3s ease'
      }}
    >
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="trigger"
              layoutId="action-button"
              onClick={() => setIsOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px -4px rgba(124, 58, 237, 0.45)',
                width: fullWidth ? '100%' : 'auto',
                minWidth: '240px',
                maxWidth: '380px'
              }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={springTransition}
            >
              {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
              <span>{triggerLabel}</span>
            </motion.button>
          ) : (
            <motion.div
              key="dialog-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={springTransition}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                borderRadius: '24px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                backgroundColor: 'rgba(26, 16, 56, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                color: '#FFFFFF',
                boxShadow: '0 20px 45px rgba(15, 7, 36, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                boxSizing: 'border-box'
              }}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    width: '40px',
                    height: '40px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(124, 58, 237, 0.4)',
                    color: '#C084FC',
                    flexShrink: 0
                  }}
                >
                  {icon ?? <Fingerprint size={22} style={{ color: '#C084FC' }} />}
                </div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
              </div>

              <p style={{ margin: '0 0 20px 0', fontSize: '13px', fontWeight: 500, color: '#DDD6FE', lineHeight: 1.55 }}>
                {description}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    height: '44px',
                    flex: 1,
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  {cancelLabel}
                </button>

                <motion.button
                  layoutId="action-button"
                  style={{
                    height: '44px',
                    flex: 1.3,
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -3px rgba(124, 58, 237, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    onConfirm?.();
                    setIsOpen(false);
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={springTransition}
                >
                  {confirmLabel}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};

export default FamilyReceiveComponent;
