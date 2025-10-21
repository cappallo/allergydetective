import React from 'react';
import type { View } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';

const DetectiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  // FIX: Replace JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const navItems: { view: View, label: string, icon: React.ReactElement }[] = [
    { view: 'detective', label: 'Detective', icon: <DetectiveIcon /> },
    { view: 'log', label: 'My Log', icon: <ClipboardListIcon className="w-6 h-6" /> },
    { view: 'database', label: 'Database', icon: <BookOpenIcon className="w-6 h-6" /> },
  ];

  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Allergy Detective
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
        Your personal tool for cross-referencing ingredients to uncover potential allergens.
      </p>
      <nav className="mt-8 max-w-md mx-auto p-1.5 bg-slate-200/75 rounded-xl shadow-sm flex items-center justify-center space-x-2">
        {navItems.map(({ view, label, icon }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm sm:text-base font-semibold ${
                isActive
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-slate-600 hover:bg-slate-300/50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;