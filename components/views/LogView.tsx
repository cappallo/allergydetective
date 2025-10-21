import React, { useState } from 'react';
import type { LogEntry } from '../../types';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';

interface LogViewProps {
  logEntries: LogEntry[];
  knownAllergies: string[];
  onAddLogEntry: (entry: Omit<LogEntry, 'id' | 'date'>) => void;
  onRemoveLogEntry: (id: string) => void;
  onAddKnownAllergy: (allergy: string) => void;
  onRemoveKnownAllergy: (allergy: string) => void;
}

const LogView: React.FC<LogViewProps> = (props) => {
  const { 
    logEntries, 
    knownAllergies, 
    onAddLogEntry, 
    onRemoveLogEntry,
    onAddKnownAllergy,
    onRemoveKnownAllergy
  } = props;
  
  const [entryName, setEntryName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryName.trim() || !symptoms.trim()) return;
    onAddLogEntry({ name: entryName, symptoms });
    setEntryName('');
    setSymptoms('');
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim() || knownAllergies.includes(newAllergy.toLowerCase())) return;
    onAddKnownAllergy(newAllergy.trim());
    setNewAllergy('');
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Log Entry Form and List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Log a New Reaction</h2>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <label htmlFor="log-name" className="block text-sm font-medium text-slate-700 mb-1">Product / Meal</label>
              <input type="text" id="log-name" value={entryName} onChange={e => setEntryName(e.target.value)} placeholder="e.g., Restaurant Pizza" className="w-full px-3 py-2 border border-slate-300 rounded-md" required/>
            </div>
            <div>
              <label htmlFor="log-symptoms" className="block text-sm font-medium text-slate-700 mb-1">Symptoms Observed</label>
              <textarea id="log-symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g., Itchy skin, headache" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md" required/>
            </div>
            <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add to Log
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Your Reaction Log</h2>
          {logEntries.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-slate-200">
              <p className="text-slate-500">Your logged reactions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...logEntries].reverse().map(entry => (
                <div key={entry.id} className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-slate-600 mt-1">{entry.symptoms}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                   <button onClick={() => onRemoveLogEntry(entry.id)} className="ml-4 p-2 text-slate-400 hover:text-red-600 rounded-full" aria-label={`Remove ${entry.name}`}>
                      <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Known Allergies */}
      <div className="lg:col-span-1">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">My Known Allergies</h2>
          <form onSubmit={handleAddAllergy} className="flex items-center space-x-2">
            <input type="text" value={newAllergy} onChange={e => setNewAllergy(e.target.value)} placeholder="e.g., Peanuts" className="flex-1 px-3 py-2 border border-slate-300 rounded-md" />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" aria-label="Add allergy">
              <PlusIcon className="h-5 w-5" />
            </button>
          </form>
          <div className="mt-4 space-y-2">
            {knownAllergies.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-2">No known allergies added yet.</p>
            ) : (
                knownAllergies.map(allergy => (
                    <div key={allergy} className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-md">
                        <span className="capitalize font-medium text-slate-700">{allergy}</span>
                        <button onClick={() => onRemoveKnownAllergy(allergy)} className="p-1 text-slate-400 hover:text-red-600" aria-label={`Remove ${allergy}`}>
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LogView;
