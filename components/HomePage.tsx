import React, { useState, useCallback, useEffect } from 'react';
import { getVisibleObjects, getLocationSuggestions } from '../services/geminiService';
import { VisibleObject } from '../types';
import { ASTRONOMICAL_CATALOGS } from '../constants';

const VisibleObjectCard: React.FC<{ object: VisibleObject }> = ({ object }) => (
  <a href={object.wikiUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300 group">
    <img src={object.imageUrl} alt={object.name} className="w-full h-48 object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop' }} />
    <div className="p-4">
      <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400">{object.name}</h3>
      <p className="text-sm text-cyan-400 font-mono">{object.type}</p>
      <p className="text-slate-300 mt-2 text-sm">{object.description}</p>
      <p className="text-slate-400 mt-2 text-xs font-medium">Distance: {object.distance}</p>
    </div>
  </a>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const LoadingSpinner = ({ small } : { small?: boolean }) => (
    <svg className={`animate-spin ${small ? 'h-5 w-5' : 'h-6 w-6'} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const HomePage: React.FC = () => {
  const [location, setLocation] = useState('New York, USA');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [catalog, setCatalog] = useState(ASTRONOMICAL_CATALOGS[0]);
  const [visibleObjects, setVisibleObjects] = useState<VisibleObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!isTyping || location.length < 3) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(() => {
      getLocationSuggestions(location).then(setSuggestions);
    }, 500);

    return () => clearTimeout(handler);
  }, [location, isTyping]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    setLocation(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setSuggestions([]);
    setIsTyping(false);
  };
  
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
    }
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setIsLocating(false);
            setSuggestions([]);
        },
        (geoError) => {
            setError(`Geolocation error: ${geoError.message}`);
            setIsLocating(false);
        }
    );
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setVisibleObjects([]);
    setSuggestions([]);
    
    if(!process.env.API_KEY) {
        setError("API key is not configured. Please set the API_KEY environment variable.");
        setIsLoading(false);
        return;
    }

    try {
      const objects = await getVisibleObjects(location, date, time, catalog);
      setVisibleObjects(objects);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [location, date, time, catalog]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Celestial Dashboard</h2>
        <p className="mt-4 text-lg leading-8 text-slate-300">Discover what's waiting in the night sky.</p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg shadow-xl border border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">What Can I Observe Now?</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1 relative">
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <div className="flex items-center gap-1">
                <input type="text" id="location" value={location} onChange={handleLocationChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" autoComplete="off" onFocus={() => setIsTyping(true)} />
                <button type="button" onClick={handleUseMyLocation} disabled={isLocating} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait">
                    {isLocating ? <LoadingSpinner small /> : <LocationIcon />}
                </button>
            </div>
            {suggestions.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-slate-600 border border-slate-500 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((s) => (
                        <li key={s} onClick={() => handleSuggestionClick(s)} className="p-2 text-sm text-white hover:bg-cyan-600 cursor-pointer">{s}</li>
                    ))}
                </ul>
            )}
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-1">Time</label>
            <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="catalog" className="block text-sm font-medium text-slate-300 mb-1">Catalog</label>
            <select id="catalog" value={catalog} onChange={e => setCatalog(e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
              {ASTRONOMICAL_CATALOGS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center h-[42px]">
              {isLoading ? <LoadingSpinner /> : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg" role="alert">{error}</div>}

      {isLoading && <div className="text-center text-slate-400 py-8">Searching the cosmos...</div>}

      {visibleObjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleObjects.map(obj => <VisibleObjectCard key={obj.name} object={obj} />)}
        </div>
      )}
    </div>
  );
};

export default HomePage;
