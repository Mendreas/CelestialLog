import React, { useState } from 'react';
import { Observation } from '../types';
import ImageViewer from './ImageViewer';

interface ObservationDetailModalProps {
  observation: Observation;
  onClose: () => void;
}

const StarIcon = ({ isFavorite }: { isFavorite: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({ observation, onClose }) => {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const displayImage = observation.imageFile || observation.imageUrl || `https://source.unsplash.com/random/800x600?space&seed=${observation.id}`;
    const displayDate = observation.observationDate 
        ? `${observation.observationDate.slice(0,2)}/${observation.observationDate.slice(2,4)}/${observation.observationDate.slice(4,8)}`
        : 'N/A';

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <div 
                    className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="md:w-1/2 w-full relative">
                        <img 
                            src={displayImage} 
                            alt={observation.objectName} 
                            className="w-full h-64 md:h-full object-cover cursor-zoom-in"
                            onClick={() => setIsImageViewerOpen(true)}
                            onError={(e) => { e.currentTarget.src = `https://source.unsplash.com/random/800x600?galaxy&seed=${observation.id}` }}
                        />
                         <div className="absolute top-2 right-2 bg-slate-900/50 p-1 rounded-full">
                            <StarIcon isFavorite={observation.isFavorite}/>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full p-6 space-y-4 overflow-y-auto">
                        <div>
                            <p className="text-sm font-mono text-cyan-400">{observation.type}</p>
                            <h2 className="text-3xl font-bold text-white mt-1">{observation.objectName}</h2>
                            <p className="text-slate-400 mt-1">{observation.location || 'N/A'} &middot; {displayDate}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-4 border-t border-slate-700">
                            <div><span className="font-semibold text-slate-300">RA:</span> <span className="text-slate-400 font-mono">{observation.ra || 'N/A'}</span></div>
                            <div><span className="font-semibold text-slate-300">DEC:</span> <span className="text-slate-400 font-mono">{observation.dec || 'N/A'}</span></div>
                            <div><span className="font-semibold text-slate-300">Magnitude:</span> <span className="text-slate-400 font-mono">{observation.magnitude || 'N/A'}</span></div>
                            <div><span className="font-semibold text-slate-300">Distance:</span> <span className="text-slate-400 font-mono">{observation.distanceValue ? `${observation.distanceValue} ${observation.distanceUnit}` : 'N/A'}</span></div>
                        </div>

                        {observation.description && (
                            <div className="pt-4 border-t border-slate-700">
                                <h3 className="font-semibold text-slate-200 mb-1">Notes</h3>
                                <p className="text-slate-300 text-base whitespace-pre-wrap">{observation.description}</p>
                            </div>
                        )}
                        
                        <div className="pt-4 flex justify-end">
                            <button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors z-[51] hidden md:block">
                    <CloseIcon />
                </button>
            </div>
            {isImageViewerOpen && (
                <ImageViewer 
                    imageUrl={displayImage} 
                    onClose={() => setIsImageViewerOpen(false)} 
                />
            )}
        </>
    );
};

export default ObservationDetailModal;