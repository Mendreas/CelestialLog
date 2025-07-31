import React, { useState, useMemo } from 'react';
import { Observation, ObjectType } from '../types';
import { OBJECT_TYPES } from '../constants';
import AddObservationForm from './AddObservationForm';
import ObservationCard from './ObservationCard';
import ObservationDetailModal from './ObservationDetailModal';

interface ObservationsPageProps {
  observations: Observation[];
  addObservation: (observation: Omit<Observation, 'id'>) => void;
  updateObservation: (observation: Observation) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const ObservationsPage: React.FC<ObservationsPageProps> = ({ observations, addObservation, updateObservation }) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null);
  const [viewingObservation, setViewingObservation] = useState<Observation | null>(null);

  const filteredObservations = useMemo(() => {
    return observations
      .filter(obs => !showFavorites || obs.isFavorite)
      .filter(obs => filterType === 'All' || obs.type === filterType);
  }, [observations, showFavorites, filterType]);
  
  const handleSaveObservation = (obs: Observation | Omit<Observation, 'id'>) => {
    if ('id' in obs && obs.id) {
        updateObservation(obs as Observation);
    } else {
        addObservation(obs as Omit<Observation, 'id'>);
    }
    setIsFormOpen(false);
    setEditingObservation(null);
  };

  const handleAddClick = () => {
    setEditingObservation(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (observation: Observation) => {
    setEditingObservation(observation);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingObservation(null);
  }

  const handleViewDetail = (observation: Observation) => {
    setViewingObservation(observation);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Observation Log</h2>
          <p className="mt-2 text-lg text-slate-300">Your personal record of celestial journeys.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          <PlusIcon/>
          New Observation
        </button>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-700 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <input
            id="favorites-filter"
            type="checkbox"
            checked={showFavorites}
            onChange={() => setShowFavorites(!showFavorites)}
            className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500"
          />
          <label htmlFor="favorites-filter" className="ml-2 text-sm font-medium text-slate-200">
            Show Favorites Only
          </label>
        </div>
        <div>
          <label htmlFor="type-filter" className="sr-only">Filter by type</label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-700 border-slate-600 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option>All</option>
            {OBJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {isFormOpen && (
        <AddObservationForm
          onSave={handleSaveObservation}
          onClose={handleCloseForm}
          observationToEdit={editingObservation}
        />
      )}

      {viewingObservation && (
        <ObservationDetailModal 
            observation={viewingObservation}
            onClose={() => setViewingObservation(null)}
        />
      )}

      {filteredObservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredObservations.map(obs => (
            <ObservationCard 
                key={obs.id} 
                observation={obs} 
                onEdit={handleEditClick} 
                onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-200">No Observations Found</h3>
          <p className="text-slate-400 mt-2">Try adjusting your filters or adding a new observation.</p>
        </div>
      )}
    </div>
  );
};

export default ObservationsPage;