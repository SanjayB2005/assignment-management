import React from 'react';
import { motion } from 'framer-motion';

const ModernCard = ({ 
  children, 
  className = '', 
  gradient = 'from-white to-gray-50',
  hover = true,
  glowing = false,
  transparent = false,
  onClick,
  ...props 
}) => {
  const baseClasses = transparent 
    ? 'bg-white/70 backdrop-blur-xl border border-white/20' 
    : `bg-gradient-to-br ${gradient} border border-gray-200/50`;

  return (
    <motion.div
      whileHover={hover ? { 
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 10 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${glowing ? 'shadow-glass hover:shadow-glow' : 'shadow-soft hover:shadow-xl'}
        ${onClick ? 'cursor-pointer' : ''}
        rounded-2xl p-6 transition-all duration-500 group
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, icon: Icon, gradient = 'from-gray-900 to-gray-600', className = '' }) => (
  <div className="flex items-center space-x-3">
    {Icon && (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl shadow-soft">
        <Icon className="h-5 w-5 text-white" />
      </div>
    )}
    <h3 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </h3>
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Export compound component
ModernCard.Header = CardHeader;
ModernCard.Title = CardTitle;
ModernCard.Content = CardContent;
ModernCard.Footer = CardFooter;

export default ModernCard;