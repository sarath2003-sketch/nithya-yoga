import React, { useState } from 'react';

export function FloatingInput({
  label,
  id,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightElement,
  className = '',
  required = false,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || `floating-${Math.random().toString(36).substring(2, 9)}`;

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue || '');
  const currentValue = isControlled ? value : internalVal;
  const hasValue = Boolean(currentValue !== undefined && currentValue !== null && String(currentValue).length > 0);

  const isFloating = focused || hasValue;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        margin: '6px 0 14px 0'
      }}
      className={`floating-input-wrap ${className}`}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              color: focused ? '#7C3AED' : '#8B5CF6',
              opacity: focused ? 1 : 0.8,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
              transition: 'color 0.2s ease'
            }}
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          required={required}
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
          style={{
            width: '100%',
            height: '52px',
            paddingLeft: icon ? '44px' : '16px',
            paddingRight: rightElement ? '46px' : '16px',
            paddingTop: isFloating ? '14px' : '0px',
            paddingBottom: '0px',
            borderRadius: '16px',
            border: focused ? '2px solid #7C3AED' : '1.5px solid #E2D9F3',
            background: focused ? '#FFFFFF' : '#FAF8FF',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1F2937',
            outline: 'none',
            boxShadow: focused ? '0 0 0 4px rgba(124, 58, 237, 0.14)' : 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          className="admin-auth-input"
          placeholder=""
          {...props}
        />

        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      <label
        htmlFor={inputId}
        style={{
          position: 'absolute',
          left: isFloating ? '16px' : (icon ? '44px' : '16px'),
          top: isFloating ? '-10px' : '16px',
          fontSize: isFloating ? '11px' : '13.5px',
          fontWeight: isFloating ? 700 : 500,
          color: focused ? '#7C3AED' : (isFloating ? '#6D28D9' : '#8B5CF6'),
          background: isFloating ? '#FAF8FF' : 'transparent',
          padding: isFloating ? '1px 8px' : '0px',
          borderRadius: isFloating ? '8px' : '0px',
          border: isFloating ? '1px solid rgba(124, 58, 237, 0.25)' : 'none',
          pointerEvents: 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 3,
          boxShadow: isFloating ? '0 2px 6px rgba(124, 58, 237, 0.08)' : 'none'
        }}
      >
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
      </label>
    </div>
  );
}

export default FloatingInput;
