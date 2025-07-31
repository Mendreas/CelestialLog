import React, { useState, useCallback } from 'react';
import { Observation, Tab } from './types';
import { TABS, INITIAL_OBSERVATIONS } from './constants';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ObservationsPage from './components/ObservationsPage';
import ResourcesPage from './components/ResourcesPage';
import CalendarPage from './components/CalendarPage';
import SettingsPage from './components/SettingsPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [observations, setObservations] = useState<Observation[]>(INITIAL_OBSERVATIONS);

  const addObservation = useCallback((newObservation: Omit<Observation, 'id'>) => {
    setObservations(prev => [
      ...prev,
      { ...newObservation, id: new Date().toISOString() }
    ]);
  }, []);

  const updateObservation = useCallback((updatedObservation: Observation) => {
    setObservations(prev => 
      prev.map(obs => obs.id === updatedObservation.id ? updatedObservation : obs)
    );
  }, []);
  
  const renderContent = () => {
    switch (activeTab) {
      case Tab.Home:
        return <HomePage />;
      case Tab.Objects:
        return <ObservationsPage observations={observations} addObservation={addObservation} updateObservation={updateObservation} />;
      case Tab.Resources:
        return <ResourcesPage />;
      case Tab.Calendar:
        return <CalendarPage observations={observations} />;
      case Tab.Settings:
        return <SettingsPage observations={observations} setObservations={setObservations} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        AstroLog &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
