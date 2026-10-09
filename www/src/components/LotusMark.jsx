import React from 'react';

/* Minimal line-art lotus used for the brand mark and quote cards.
   Stroke/fill come from the CSS class passed in. */
const PETAL = 'M0 0C-0.30 -0.20 -0.32 -0.72 0 -1C0.32 -0.72 0.30 -0.20 0 0Z';

export default function LotusMark({ className }) {
  const petals = [
    { a: -62, s: 7.6 },
    { a: 62, s: 7.6 },
    { a: -31, s: 10 },
    { a: 31, s: 10 },
    { a: 0, s: 11.5 }
  ];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {petals.map((p, i) => (
        <path
          key={i}
          d={PETAL}
          transform={`translate(12 17.5) rotate(${p.a}) scale(${p.s})`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d="M5.5 19.2C9.2 21 14.8 21 18.5 19.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
