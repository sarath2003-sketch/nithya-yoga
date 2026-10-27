import React, { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ChevronDown, Send, Layers } from 'lucide-react';
import { HiCursorArrowRipple } from 'react-icons/hi2';
import { IoIosTimer } from 'react-icons/io';
import { PiHandTap } from 'react-icons/pi';
import useMeasure from 'react-use-measure';

const springTransition = {
  type: 'spring',
  stiffness: 600,
  damping: 50,
  mass: 1,
};

export const YOGA_ACCORDION_ITEMS = [
  {
    id: 1,
    title: 'Surya Namaskar & Warmup Flow',
    icon: <HiCursorArrowRipple className="size-4 -rotate-12 text-violet-400" />,
    content:
      '12 foundational postures synchronized with rhythmic pranayama to warm up joints, enhance spine flexibility, and boost circulation.',
  },
  {
    id: 2,
    title: 'Asana Alignment & Posture Focus',
    icon: <Layers size={20} className="text-purple-400" />,
    content:
      'Step-by-step guidance on Tadasana, Virabhadrasana, and Vrikshasana with precision micro-adjustments for optimal balance and core stability.',
  },
  {
    id: 3,
    title: 'Pranayama & Breath Synchronization',
    icon: <PiHandTap size={22} className="-rotate-12 text-emerald-400" />,
    content:
      'Conscious breath control techniques including Nadi Shodhana and Kapalabhati to calm the nervous system and deepen inner presence.',
  },
  {
    id: 4,
    title: 'Interactive Live Studio Questions',
    icon: <Send size={20} className="text-sky-400" />,
    content:
      'Real-time posture feedback from verified instructors, student questions, and customized pose variations for all experience levels.',
  },
  {
    id: 5,
    title: 'Shavasana & Sound Healing Relaxation',
    icon: <IoIosTimer size={22} className="text-amber-400" />,
    content:
      'Deep restorative relaxation integrating 432Hz ambient sound waves and guided body scan meditation to integrate practice benefits.',
  },
];

export const DEFAULT_ITEMS = [
  {
    id: 1,
    title: 'What is Interaction Design?',
    icon: <HiCursorArrowRipple className="size-3 -rotate-10 md:size-4" />,
    content:
      'Interaction design focuses on creating engaging interfaces with well-thought-out behaviors and actions.',
  },
  {
    id: 2,
    title: 'Principles & Patterns',
    icon: <Layers size={20} />,
    content:
      'Fundamental guidelines and repeated solutions that ensure consistency and usability in design.',
  },
  {
    id: 3,
    title: 'Usability & Accessibility',
    icon: <PiHandTap size={22} className="-rotate-20" />,
    content:
      'Designing experiences that are easy to use and accessible to people of all abilities.',
  },
  {
    id: 4,
    title: 'Prototyping & Testing',
    icon: <Send size={20} />,
    content:
      'Rapid experimentation and validation of ideas through prototypes and real user testing.',
  },
  {
    id: 5,
    title: 'UX Optimisation',
    icon: <IoIosTimer size={22} />,
    content:
      'Improving user experience by analyzing behavior and refining interactions over time.',
  },
];

const AccordionItem = ({
  item,
  setOpenId,
  index,
  total,
  openIndex,
}) => {
  const [ref, bounds] = useMeasure();
  const isOpen = index === openIndex;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const isBeforeOpen = index === openIndex - 1;
  const isAfterOpen = index === openIndex + 1;

  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  const BORDER_WIDTH = '1.5px';
  const BORDER_STYLE = 'solid';
  const borderTopWidth =
    isFirst || isAfterOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderBottomWidth =
    isLast || isBeforeOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderLeftWidth = BORDER_WIDTH;
  const borderRightWidth = BORDER_WIDTH;

  let borderTopLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderBottomRightRadius = 0;

  if (isOpen || isAlone) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  } else if (isBeforeOpen) {
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  } else if (isAfterOpen) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
  } else if (isFirst) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
  } else if (isLast) {
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  }

  const borderColor = isOpen ? 'var(--primary-color, #8b5cf6)' : 'var(--border-subtle, rgba(226, 232, 240, 0.9))';
  const backgroundColor = isOpen ? 'rgba(139, 92, 246, 0.04)' : 'var(--bg-card, #ffffff)';
  const shadow = isOpen ? '0 10px 25px -5px rgba(139, 92, 246, 0.15)' : 'none';

  return (
    <MotionConfig transition={springTransition}>
      <motion.li layout style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        <motion.div
          animate={{
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
            boxShadow: shadow,
          }}
          style={{
            borderTopWidth,
            borderBottomWidth,
            borderLeftWidth,
            borderRightWidth,
            borderStyle: BORDER_STYLE,
            borderColor,
            background: backgroundColor,
            marginBlock: isOpen ? '12px' : '0px',
            overflow: 'hidden',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          <button
            type="button"
            onClick={() => setOpenId(isOpen ? null : item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary-color, #8b5cf6)' }}>
                {item.icon}
              </span>

              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-heading, #1e1b4b)', lineHeight: 1.3 }}>
                {item.title}
              </span>
            </div>

            <motion.div 
              animate={{ rotate: isOpen ? 180 : 0 }} 
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 'auto', color: isOpen ? 'var(--primary-color, #8b5cf6)' : 'var(--text-muted, #94a3b8)' }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isOpen ? bounds.height : 0,
              opacity: isOpen ? 1 : 0,
            }}
            style={{ overflow: 'hidden' }}
          >
            <div ref={ref}>
              <div style={{ padding: '0 16px 16px 44px', fontSize: '12.5px', fontWeight: 500, lineHeight: 1.6, color: 'var(--text-sub, #64748b)' }}>
                {item.content}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.li>
    </MotionConfig>
  );
};

export const CardSplitAccordion = ({ items, className = '' }) => {
  const defaultItems = items ?? YOGA_ACCORDION_ITEMS;
  const [openId, setOpenId] = useState(null);

  const openIndex = defaultItems.findIndex((item) => item.id === openId);

  return (
    <div className={`flex w-full flex-col items-center justify-center transition-colors duration-500 ${className}`}>
      <ul className="w-full max-w-lg p-0 m-0">
        {defaultItems.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            setOpenId={setOpenId}
            index={index}
            total={defaultItems.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export const AccordionApp = CardSplitAccordion;
export default CardSplitAccordion;
