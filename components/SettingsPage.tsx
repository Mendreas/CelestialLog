
import React, { useRef } from 'react';
import { Observation, ObjectType, DistanceUnit } from '../types';

interface SettingsPageProps {
  observations: Observation[];
  setObservations: React.Dispatch<React.SetStateAction<Observation[]>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ observations, setObservations }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const dataStr = JSON.stringify(observations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'AstroLog_Observations.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file.");
        }
        
        const rawData = JSON.parse(text);

        if (!Array.isArray(rawData)) {
            throw new Error("JSON data is not an array.");
        }

        const mapUnit = (unit?: string): DistanceUnit => {
            const u = unit?.toLowerCase() || '';
            if (u.includes('million')) return DistanceUnit.MillionLightYears;
            if (u === 'ly' || u.includes('light')) return DistanceUnit.LightYears;
            if (u === 'parsecs') return DistanceUnit.Parsecs;
            if (u === 'au') return DistanceUnit.AU;
            if (u === 'km') return DistanceUnit.Km;
            return unit as DistanceUnit || DistanceUnit.LightYears;
        };

        const mapType = (type?: string): ObjectType => {
            const capitalized = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Other';
            return Object.values(ObjectType).includes(capitalized as ObjectType) ? capitalized as ObjectType : ObjectType.Other;
        }

        const formatDate = (dateStr?: string): string => {
            if (!dateStr) return '';
            // Check if it's already in DDMMYYYY format
            if (/^\d{8}$/.test(dateStr)) return dateStr;

            const d = new Date(dateStr);
            if(isNaN(d.getTime())) return dateStr; // Fallback for unparsable dates
            
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}${month}${year}`;
        }
        
        const importedObservations: Observation[] = rawData.map((item: any): Observation => {
            return {
              id: String(item.id || new Date().toISOString() + Math.random()),
              objectName: item.objectName || item.name || 'Unknown Object',
              type: mapType(item.type),
              observationDate: formatDate(item.observationDate || item.date),
              location: item.location || '',
              ra: item.ra || '',
              dec: item.dec || '',
              magnitude: String(item.magnitude || ''),
              distanceValue: String(item.distanceValue || item.distance || ''),
              distanceUnit: mapUnit(item.distanceUnit),
              description: item.description || '',
              imageUrl: item.imageUrl || item.image || '',
              imageFile: undefined, // Not applicable for JSON import
              isFavorite: typeof item.isFavorite === 'boolean' ? item.isFavorite : (typeof item.favorite === 'boolean' ? item.favorite : false),
            };
        });

        if (importedObservations.length > 0) {
            setObservations(importedObservations);
            alert(`${importedObservations.length} observations loaded successfully!`);
        } else if (rawData.length === 0) {
            setObservations([]);
            alert('File was empty. All observations cleared.');
        } else {
            alert('Could not parse any valid observations from the file.');
        }

      } catch (error: any) {
        console.error('Error parsing JSON file:', error);
        alert(`Failed to load observations: ${error.message}`);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Settings</h2>
        <p className="mt-2 text-lg text-slate-300">Manage your application data and preferences.</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
        <h3 className="text-xl font-semibold text-cyan-400">Data Management</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Save Observations to File
          </button>
          <button
            onClick={handleUploadClick}
            className="w-full sm:w-auto flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Load Observations from File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Preferences</h3>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-1">App Language</label>
          <select id="language" className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option>English</option>
            <option disabled>Español (coming soon)</option>
            <option disabled>Français (coming soon)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
