import React from 'react';
import { Observation } from '../types';

interface ObservationCardProps {
  observation: Observation;
  onEdit: (observation: Observation) => void;
  onViewDetail: (observation: Observation) => void;
}

const StarIcon = ({ isFavorite }: { isFavorite: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);


const ObservationCard: React.FC<ObservationCardProps> = ({ observation, onEdit, onViewDetail }) => {
    
    const displayDate = `${observation.observationDate.slice(0,2)}/${observation.observationDate.slice(2,4)}/${observation.observationDate.slice(4,8)}`;
    const displayImage = observation.imageFile || observation.imageUrl || `https://source.unsplash.com/random/400x200?&seed=${observation.id}`;

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(observation);
    };

    return (
        <div 
            className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-cyan-500/20 cursor-pointer"
            onClick={() => onViewDetail(observation)}
            onKeyDown={(e) => e.key === 'Enter' && onViewDetail(observation)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${observation.objectName}`}
        >
            <div className="relative">
                <img src={displayImage} alt={observation.objectName} className="w-full h-48 object-cover pointer-events-none" onError={(e) => { e.currentTarget.src = `https://source.unsplash.com/random/400x200?space&seed=${observation.id}` }} />
                <div className="absolute top-2 right-2 bg-slate-900/50 p-1 rounded-full">
                    <StarIcon isFavorite={observation.isFavorite}/>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <p className="text-sm font-mono text-cyan-400">{observation.type}</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{observation.objectName}</h3>
                <p className="text-sm text-slate-400">{displayDate} &middot; {observation.location}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="font-semibold text-slate-300">RA:</span> <span className="text-slate-400 font-mono">{observation.ra || 'N/A'}</span></div>
                    <div><span className="font-semibold text-slate-300">DEC:</span> <span className="text-slate-400 font-mono">{observation.dec || 'N/A'}</span></div>
                    <div><span className="font-semibold text-slate-300">Mag:</span> <span className="text-slate-400 font-mono">{observation.magnitude || 'N/A'}</span></div>
                    <div><span className="font-semibold text-slate-300">Dist:</span> <span className="text-slate-400 font-mono">{observation.distanceValue} {observation.distanceUnit}</span></div>
                </div>

                <p className="mt-4 text-slate-300 text-sm flex-grow">{observation.description}</p>
                 <div className="mt-4 pt-4 border-t border-slate-700/50 text-right">
                    <button
                        onClick={handleEditClick}
                        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        aria-label={`Edit observation for ${observation.objectName}`}
                    >
                        <EditIcon/>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObservationCard;