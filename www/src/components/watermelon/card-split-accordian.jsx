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

  const BORDER_WIDTH = '1px';
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
    borderTopLeftRadius = 20;
    borderTopRightRadius = 20;
    borderBottomLeftRadius = 20;
    borderBottomRightRadius = 20;
  } else if (isBeforeOpen) {
    borderBottomLeftRadius = 20;
    borderBottomRightRadius = 20;
  } else if (isAfterOpen) {
    borderTopLeftRadius = 20;
    borderTopRightRadius = 20;
  } else if (isFirst) {
    borderTopLeftRadius = 20;
    borderTopRightRadius = 20;
  } else if (isLast) {
    borderBottomLeftRadius = 20;
    borderBottomRightRadius = 20;
  }

  return (
    <MotionConfig transition={springTransition}>
      <motion.li layout style={{ listStyle: 'none' }}>
        <motion.div
          animate={{
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
          }}
          className="overflow-hidden border-solid border-zinc-200/80 bg-zinc-50/90 backdrop-blur-md will-change-transform dark:border-white/10 dark:bg-[#16102E]/90 transition-colors"
          style={{
            borderTopWidth,
            borderBottomWidth,
            borderLeftWidth,
            borderRightWidth,
            borderStyle: BORDER_STYLE,
            marginBlock: isOpen ? '12px' : '0px',
          }}
        >
          <button
            type="button"
            onClick={() => setOpenId(isOpen ? null : item.id)}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center text-violet-500">
                {item.icon}
              </span>

              <span className="text-sm font-bold text-zinc-900 md:text-base dark:text-zinc-100">
                {item.title}
              </span>
            </div>

            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="size-5 text-neutral-400 dark:text-zinc-400" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isOpen ? bounds.height : 0,
              opacity: isOpen ? 1 : 0,
            }}
            className="overflow-hidden will-change-transform"
          >
            <div ref={ref}>
              <div className="px-5 pb-5 text-xs font-medium leading-relaxed text-zinc-600 md:text-sm dark:text-zinc-300/80">
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
