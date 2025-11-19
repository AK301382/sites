import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${
        hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };
