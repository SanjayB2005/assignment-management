import React, { useState } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = ({ isOpen, onToggle, activeTab, setActiveTab, tabs }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onToggle} />
      
      {/* Mobile menu */}
      <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  onToggle();
                }}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const ResponsiveHeader = ({ title, user, logout, showMobileMenu, setShowMobileMenu }) => {
  return (
    <header className="bg-white shadow-soft border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2 lg:ml-0">{title}</h1>
          </div>

          {/* Desktop user menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile user indicator */}
          <div className="lg:hidden flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-500" />
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ResponsiveCard = ({ children, className = "", padding = "p-6" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-soft border border-gray-200 ${padding} ${className}`}>
      {children}
    </div>
  );
};

const ResponsiveGrid = ({ children, cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }) => {
  return (
    <div className={`grid ${cols} gap-4 sm:gap-6`}>
      {children}
    </div>
  );
};

const ResponsiveTable = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-soft ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className={`min-w-full divide-y divide-gray-300 ${className}`}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

const ResponsiveModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        {/* Modal */}
        <div className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:${maxWidth} sm:p-6`}>
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
                {title}
              </h3>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResponsiveButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  fullWidth = false, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

const ResponsiveInput = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]} ${className}`} />
  );
};

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export {
  MobileNavigation,
  ResponsiveHeader,
  ResponsiveCard,
  ResponsiveGrid,
  ResponsiveTable,
  ResponsiveModal,
  ResponsiveButton,
  ResponsiveInput,
  LoadingSpinner,
  EmptyState
};