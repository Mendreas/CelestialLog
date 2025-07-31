
import React from 'react';
import { Tab } from '../types';
import { TABS } from '../constants';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const ScopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <ScopeIcon />
            <h1 className="ml-3 text-2xl font-bold text-slate-100 tracking-tight">AstroLog</h1>
          </div>
          <nav className="hidden md:flex space-x-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:hidden pb-2">
           <div className="flex flex-wrap justify-center space-x-1">
            {TABS.map(tab => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-grow px-3 py-2 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                    ? 'bg-cyan-500 text-white shadow'
                    : 'text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white'
                }`}
                >
                {tab}
                </button>
            ))}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
