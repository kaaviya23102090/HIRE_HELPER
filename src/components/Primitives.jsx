import React, { useState } from 'react';

export const Button = ({ children, variant = 'primary', className = '', style: customStyle, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyle = {
    padding: '0.75rem 1.75rem',
    borderRadius: '16px', 
    fontWeight: '700',
    fontSize: '0.9375rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    userSelect: 'none'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', // Harder blue for high visibility
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
    },
    premium: {
       background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
       color: '#ffffff',
       boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #e2e8f0'
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      color: '#ef4444',
      border: '1.5px solid rgba(239, 68, 68, 0.15)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
    }
  };

  const finalStyle = { ...baseStyle, ...variants[variant], ...customStyle };
  if (props.disabled) {
    finalStyle.opacity = '0.5';
    finalStyle.cursor = 'not-allowed';
    finalStyle.boxShadow = 'none';
    finalStyle.transform = 'none';
  }

  return (
    <button 
      {...props}
      style={finalStyle} 
      onMouseDown={() => !props.disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => {
  const containerStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' };
  const labelStyle = { fontSize: '0.75rem', color: '#64748b', fontWeight: '800', letterSpacing: '0.04em' };
  const inputStyle = {
    backgroundColor: '#f8fafc', border: '1.5px solid #f1f5f9', padding: '0.875rem 1.125rem',
    borderRadius: '14px', fontSize: '0.9375rem', color: '#1e293b', width: '100%', outline: 'none', transition: 'all 0.2s'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        {...props}
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.backgroundColor = '#fff'; }}
        onBlur={(e) => { e.target.style.borderColor = '#f1f5f9'; e.target.style.backgroundColor = '#f8fafc'; }}
      />
    </div>
  );
};
