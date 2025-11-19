import React from 'react';

const Badge = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-rose-100 text-rose-700',
    secondary: 'bg-red-50 text-rose-600'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        variants[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
