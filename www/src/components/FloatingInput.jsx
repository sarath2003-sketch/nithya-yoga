import React, { useState } from 'react';
import { cn } from '../utils/cn';

export function FloatingInput({
  label,
  className = '',
  id,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightElement,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || `floating-${Math.random().toString(36).substring(2, 9)}`;

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue || '');
  const currentValue = isControlled ? value : internalVal;
  const hasValue = Boolean(currentValue !== undefined && currentValue !== null && String(currentValue).length > 0);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 z-10 pointer-events-none text-purple-400/80 transition-colors">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            "peer w-full rounded-2xl border text-sm font-medium transition-all duration-200 outline-none",
            "bg-white/5 border-violet-500/25 text-white placeholder-transparent",
            "focus:border-violet-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20",
            icon ? "pl-11 pr-4 py-3.5" : "px-4 py-3.5",
            rightElement ? "pr-11" : "",
            className
          )}
          placeholder=" "
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (!isControlled) setInternalVal(e.target.value);
            onBlur?.(e);
          }}
          onChange={(e) => {
            if (!isControlled) setInternalVal(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 z-10 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      <label
        htmlFor={inputId}
        className={cn(
          "absolute text-xs font-semibold tracking-wide pointer-events-none transition-all duration-200",
          icon ? "left-11 top-3.5" : "left-4 top-3.5",
          "text-purple-300/60",
          (focused || hasValue)
            ? `-top-2.5 ${icon ? 'left-4' : 'left-3'} text-[11px] font-bold text-violet-400 bg-[#16102E] px-2 rounded-md shadow-sm border border-violet-500/20`
            : "text-sm",
          focused ? "text-violet-400 border-violet-500/40" : ""
        )}
      >
        {label}
      </label>
    </div>
  );
}

export default FloatingInput;
