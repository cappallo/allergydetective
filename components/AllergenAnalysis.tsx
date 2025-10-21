
import React from 'react';
import type { Allergen } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface AllergenAnalysisProps {
  allergens: Allergen[];
  selectedAllergen: string | null;
  details: string | null;
  isLoadingDetails: boolean;
  onSelectAllergen: (allergenName: string) => void;
}

// A simple, safe markdown renderer component defined inside the main component file.
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-2 text-slate-600">
      {lines.map((line, index) => {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={index} className="flex items-start">
              <span className="mr-2 mt-1 text-indigo-500">•</span>
              <span>{line.replace(/(-|\*)\s*/, '')}</span>
            </div>
          );
        }

        const boldedLine = line.split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{part}</strong> : part
        );

        return <p key={index}>{boldedLine}</p>;
      })}
    </div>
  );
};


const AllergenAnalysis: React.FC<AllergenAnalysisProps> = ({ allergens, selectedAllergen, details, isLoadingDetails, onSelectAllergen }) => {
  const hasResults = allergens.length > 0;
  const hasSelection = selectedAllergen !== null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Analysis Results</h2>
        <p className="text-sm text-slate-500">Common ingredients found in multiple items.</p>
      </div>
      
      {!hasResults && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p className="text-slate-500">Add at least two items with common ingredients to see potential allergens.</p>
        </div>
      )}

      {hasResults && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
          <div className="border-r border-slate-200 overflow-y-auto">
            <ul>
              {allergens.map(allergen => (
                <li key={allergen.name}>
                  <button 
                    onClick={() => onSelectAllergen(allergen.name)}
                    className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 ${selectedAllergen === allergen.name ? 'bg-indigo-50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`font-semibold capitalize ${selectedAllergen === allergen.name ? 'text-indigo-700' : 'text-slate-700'}`}>{allergen.name}</p>
                        <p className="text-xs text-slate-500">Found in {allergen.count} items</p>
                      </div>
                      <ChevronRightIcon className={`h-5 w-5 text-slate-400 transition-transform ${selectedAllergen === allergen.name ? 'translate-x-1 text-indigo-600' : ''}`}/>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 overflow-y-auto">
            {!hasSelection && (
              <div className="flex items-center justify-center h-full text-center">
                <p className="text-slate-500">Select a potential allergen from the left to learn more about it.</p>
              </div>
            )}
            {isLoadingDetails && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <SpinnerIcon className="h-8 w-8 text-indigo-600 animate-spin mb-4"/>
                <p className="text-slate-500">Fetching information...</p>
              </div>
            )}
            {!isLoadingDetails && details && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <h3 className="text-xl font-bold text-slate-800 mb-4 capitalize">{selectedAllergen}</h3>
                <SimpleMarkdownRenderer content={details} />
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
    </div>
  );
};

export default AllergenAnalysis;
