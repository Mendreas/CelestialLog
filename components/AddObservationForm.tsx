import React, { useState, useEffect } from 'react';
import { Observation, ObjectType, DistanceUnit } from '../types';
import { OBJECT_TYPES, DISTANCE_UNITS } from '../constants';

interface AddObservationFormProps {
  onSave: (observation: Observation | Omit<Observation, 'id'>) => void;
  onClose: () => void;
  observationToEdit?: Observation | null;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const getInitialFormData = (): Omit<Observation, 'id'> => ({
    objectName: '',
    type: ObjectType.Star,
    observationDate: new Date().toISOString().slice(0, 10).replace(/-/g, '').split('').reverse().join(''), // DDMMYYYY
    location: '',
    ra: '',
    dec: '',
    magnitude: '',
    distanceValue: '',
    distanceUnit: DistanceUnit.LightYears,
    description: '',
    imageUrl: '',
    imageFile: undefined,
    isFavorite: false,
});


const AddObservationForm: React.FC<AddObservationFormProps> = ({ onSave, onClose, observationToEdit }) => {
  const isEditing = !!observationToEdit;
  const [formData, setFormData] = useState<Omit<Observation, 'id'> | Observation>(
    isEditing ? observationToEdit : getInitialFormData()
  );

  useEffect(() => {
    if (isEditing) {
      setFormData(observationToEdit);
    } else {
      setFormData(getInitialFormData());
    }
  }, [observationToEdit, isEditing]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yyyymmdd = e.target.value;
    if (yyyymmdd) {
        const [year, month, day] = yyyymmdd.split('-');
        setFormData(prev => ({...prev, observationDate: `${day}${month}${year}`}));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, imageFile: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.objectName) {
      alert("Object Name is required.");
      return;
    }
    onSave(formData);
  };
  
  const yyyymmdd = formData.observationDate 
    ? `${formData.observationDate.slice(4, 8)}-${formData.observationDate.slice(2, 4)}-${formData.observationDate.slice(0, 2)}` 
    : '';


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
            <CloseIcon />
        </button>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">{isEditing ? 'Edit Observation' : 'Log New Observation'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="objectName" className="block text-sm font-medium text-slate-300">Object Name*</label>
              <input type="text" name="objectName" value={formData.objectName} onChange={handleChange} required className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-300">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                {OBJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="observationDate" className="block text-sm font-medium text-slate-300">Observation Date</label>
              <input type="date" name="observationDate" value={yyyymmdd} onChange={handleDateChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
             <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-300">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
             <div>
              <label htmlFor="ra" className="block text-sm font-medium text-slate-300">RA</label>
              <input type="text" name="ra" value={formData.ra} onChange={handleChange} placeholder="e.g. 17h 45m 40s" className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
             <div>
              <label htmlFor="dec" className="block text-sm font-medium text-slate-300">DEC</label>
              <input type="text" name="dec" value={formData.dec} onChange={handleChange} placeholder="e.g. -29° 00′ 28″" className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
             <div>
              <label htmlFor="magnitude" className="block text-sm font-medium text-slate-300">Magnitude</label>
              <input type="text" name="magnitude" value={formData.magnitude} onChange={handleChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label htmlFor="distanceValue" className="block text-sm font-medium text-slate-300">Distance</label>
                    <input type="number" name="distanceValue" value={formData.distanceValue} onChange={handleChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                     <label htmlFor="distanceUnit" className="block text-sm font-medium text-slate-300 invisible">Unit</label>
                     <select name="distanceUnit" value={formData.distanceUnit} onChange={handleChange} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                        {DISTANCE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"></textarea>
          </div>
          
           <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="e.g. https://i.imgur.com/..." className="mt-1 w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-slate-300">Or Upload Image</label>
              <input type="file" name="imageFile" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
            </div>
            {formData.imageFile && <img src={formData.imageFile} alt="Preview" className="mt-2 rounded-lg max-h-40" />}
          
            <div className="flex items-center">
              <input id="isFavorite" name="isFavorite" type="checkbox" checked={formData.isFavorite} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-600 focus:ring-cyan-500" />
              <label htmlFor="isFavorite" className="ml-2 block text-sm text-slate-200">Mark as favorite</label>
            </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">{isEditing ? 'Save Changes' : 'Save Observation'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddObservationForm;
