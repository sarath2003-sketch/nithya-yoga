import React, { useEffect, useState } from 'react';
import { Undo2 } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import useMeasure from 'react-use-measure';
import { cn } from '../utils/cn';

function AnimatedText({
  text,
  className = '',
  style = {},
  delayStep = 0.014,
}) {
  const chars = String(text || '').split('');

  return (
    <span className={className} style={{ display: 'inline-flex', ...style }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          style={{ display: 'inline-flex', willChange: 'transform' }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              initial={{
                y: 10,
                opacity: 0,
                scale: 0.5,
                filter: 'blur(2px)',
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                y: -10,
                opacity: 0,
                scale: 0.5,
                filter: 'blur(2px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 16,
                mass: 1.2,
                delay: i * delayStep,
              }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : undefined,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export const TimedUndoAction = ({
  initialSeconds = 10,
  deleteLabel = 'Delete Account',
  undoLabel = 'Cancel Delete',
  icon,
  onDelete,
  onCancel,
  autoStart = false,
  className = '',
}) => {
  const [isDeleting, setIsDeleting] = useState(autoStart);
  const [countDown, setCountDown] = useState(initialSeconds);
  const [ref, bounds] = useMeasure({ offsetSize: true });

  const handleDelete = () => {
    setIsDeleting((prev) => {
      const next = !prev;
      if (next) {
        setCountDown(initialSeconds);
      } else {
        onCancel?.();
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isDeleting) return;

    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDeleting(false);
          onDelete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isDeleting, initialSeconds, onDelete]);

  return (
    <div 
      className={cn("flex w-full items-center justify-center font-sans", className)}
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
      }}
    >
      <div 
        className="flex flex-col items-center justify-center will-change-transform"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionConfig
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 22,
          }}
        >
          <motion.div
            className={cn(
              'relative flex cursor-pointer items-center justify-start overflow-hidden rounded-full transition-colors duration-300',
              isDeleting ? 'bg-red-500/15' : 'bg-red-600',
            )}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
              borderRadius: '9999px',
              cursor: 'pointer',
              backgroundColor: isDeleting ? 'rgba(239, 68, 68, 0.15)' : '#DC2626',
              border: isDeleting ? '1.5px solid #EF4444' : '1.5px solid transparent',
              boxShadow: isDeleting 
                ? '0 0 20px rgba(239, 68, 68, 0.35)' 
                : '0 8px 20px -3px rgba(220, 38, 38, 0.5)',
              transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            animate={{
              width: bounds.width > 0 ? bounds.width : 'auto',
            }}
            onClick={handleDelete}
          >
            <div
              className={cn(
                'flex items-center justify-center gap-2 px-6 py-3',
                isDeleting && 'px-3',
              )}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: isDeleting ? '8px 14px' : '12px 24px',
                boxSizing: 'border-box',
              }}
              ref={ref}
            >
              <AnimatePresence mode="popLayout">
                {isDeleting && (
                  <motion.div
                    className="rounded-full bg-red-500 p-2"
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: '#EF4444',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                    initial={{
                      opacity: 0,
                      filter: 'blur(2px)',
                    }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      filter: 'blur(2px)',
                    }}
                  >
                    {icon ?? <Undo2 size={18} style={{ color: '#FFFFFF' }} />}
                  </motion.div>
                )}
              </AnimatePresence>

              <div 
                className="flex items-center justify-center gap-2"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <AnimatedText
                  text={isDeleting ? undoLabel : deleteLabel}
                  className={cn(
                    'z-10 text-base font-bold',
                    isDeleting ? 'text-red-400' : 'text-neutral-50',
                  )}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: isDeleting ? '#EF4444' : '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                />
              </div>

              <AnimatePresence mode="popLayout">
                {isDeleting && (
                  <motion.div
                    className="flex items-center justify-center rounded-full bg-red-500 px-3 py-1 text-neutral-50 tabular-nums"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '9999px',
                      backgroundColor: '#EF4444',
                      padding: '2px 10px',
                      color: '#FFFFFF',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                    initial={{
                      opacity: 0,
                      filter: 'blur(2px)',
                    }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      filter: 'blur(2px)',
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={countDown}
                        initial={{
                          opacity: 0,
                          y: -20,
                          filter: 'blur(2px)',
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          filter: 'blur(2px)',
                          scale: 0.5,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 240,
                          damping: 20,
                          mass: 1,
                        }}
                      >
                        {countDown}s
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </div>
  );
};

export default TimedUndoAction;
