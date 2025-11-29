import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
    }`;
  const mobileLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white shadow-md z-20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-blue-600">
              SaveMe
            </NavLink>
          </div>
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" className={linkClasses}>
              Map View
            </NavLink>
            <NavLink to="/alerts" className={linkClasses}>
              Incidents
            </NavLink>
            <NavLink to="/food-requests" className={linkClasses}>
              Food Requests
            </NavLink>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              Map View
            </NavLink>
            <NavLink to="/alerts" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              Incidents
            </NavLink>
            <NavLink to="/food-requests" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              Food Requests
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
