import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  glass = false,
  bordered = true,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-300
        ${glass ? 'glass-panel' : 'bg-white'}
        ${bordered ? 'border border-slate-200/80' : ''}
        ${hoverable ? 'hover:shadow-card-hover hover:-translate-y-0.5 hover:border-slate-300' : 'shadow-subtle'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-6 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`p-6 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl ${className}`}>{children}</div>;
}
