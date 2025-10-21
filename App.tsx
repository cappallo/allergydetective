import React, { useState, useEffect, useCallback } from 'react';
import type { ReactionItem, Allergen, LogEntry, View } from './types';
import { parseIngredients, getIngredientInfo } from './services/geminiService';

import useLocalStorage from './hooks/useLocalStorage';

import Header from './components/Header';
import DetectiveView from './components/views/DetectiveView';
import LogView from './components/views/LogView';
import DatabaseView from './components/views/DatabaseView';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import BarcodeIcon from './components/icons/BarcodeIcon';

const App: React.FC = () => {
  const [reactionItems, setReactionItems] = useLocalStorage<ReactionItem[]>('reactionItems', []);
  const [logEntries, setLogEntries] = useLocalStorage<LogEntry[]>('logEntries', []);
  const [knownAllergies, setKnownAllergies] = useLocalStorage<string[]>('knownAllergies', []);
  
  const [currentView, setCurrentView] = useState<View>('detective');
  const [potentialAllergens, setPotentialAllergens] = useState<Allergen[]>([]);
  const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);
  const [allergenDetails, setAllergenDetails] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState<{ name: string; ingredients: string } | null>(null);

  const handleAddItem = async (name: string, rawIngredients: string) => {
    setIsParsing(true);
    setError(null);
    try {
      const ingredients = await parseIngredients(rawIngredients);
      const newItem: ReactionItem = {
        id: crypto.randomUUID(),
        name,
        rawIngredients,
        ingredients,
      };
      setReactionItems(prevItems => [...prevItems, newItem]);
      setScannedData(null); // Clear scanned data after adding
    } catch (e) {
      setError("Failed to parse ingredients. Please try again.");
      console.error("Failed to parse ingredients:", e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setReactionItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleSelectAllergen = useCallback(async (allergenName: string) => {
    if (selectedAllergen === allergenName && allergenDetails) return;
    setSelectedAllergen(allergenName);
    setIsFetchingDetails(true);
    setAllergenDetails(null);
    setError(null);
    try {
      const details = await getIngredientInfo(allergenName);
      setAllergenDetails(details);
    } catch (e) {
      setError("Failed to fetch allergen details. Please try again.");
      console.error("Failed to fetch allergen details:", e);
    } finally {
      setIsFetchingDetails(false);
    }
  }, [selectedAllergen, allergenDetails]);
  
  const analyzeIngredients = useCallback(() => {
    const ingredientMap = new Map<string, { count: number; items: string[] }>();
    reactionItems.forEach(item => {
        const uniqueIngredients = new Set(item.ingredients.map(i => i.toLowerCase()));
        uniqueIngredients.forEach(ingredient => {
            const entry = ingredientMap.get(ingredient) || { count: 0, items: [] };
            entry.count++;
            entry.items.push(item.name);
            ingredientMap.set(ingredient, entry);
        });
    });
    const allergens: Allergen[] = [];
    ingredientMap.forEach((value, key) => {
        if (value.count > 1 && !knownAllergies.includes(key)) {
            allergens.push({ name: key, count: value.count, items: value.items });
        }
    });
    allergens.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    setPotentialAllergens(allergens);
    if(selectedAllergen && !allergens.some(a => a.name === selectedAllergen)) {
      setSelectedAllergen(null);
      setAllergenDetails(null);
    }
  }, [reactionItems, selectedAllergen, knownAllergies]);

  useEffect(() => {
    analyzeIngredients();
  }, [reactionItems, knownAllergies, analyzeIngredients]);

  // Log Handlers
  const handleAddLogEntry = (entry: Omit<LogEntry, 'id' | 'date'>) => {
    const newEntry: LogEntry = { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() };
    setLogEntries(prev => [...prev, newEntry]);
  };
  const handleRemoveLogEntry = (id: string) => setLogEntries(prev => prev.filter(e => e.id !== id));

  // Known Allergies Handlers
  const handleAddKnownAllergy = (allergy: string) => setKnownAllergies(prev => [...new Set([...prev, allergy.toLowerCase()])].sort());
  const handleRemoveKnownAllergy = (allergy: string) => setKnownAllergies(prev => prev.filter(a => a !== allergy));

  // Barcode Scanner Handler
  const handleScanSuccess = (data: { name: string, ingredients: string }) => {
    setScannedData(data);
    setCurrentView('detective'); // Switch to detective view to show the pre-filled form
  };

  const renderView = () => {
    switch (currentView) {
      case 'log':
        return <LogView 
          logEntries={logEntries}
          knownAllergies={knownAllergies}
          onAddLogEntry={handleAddLogEntry}
          onRemoveLogEntry={handleRemoveLogEntry}
          onAddKnownAllergy={handleAddKnownAllergy}
          onRemoveKnownAllergy={handleRemoveKnownAllergy}
        />;
      case 'database':
        return <DatabaseView />;
      case 'detective':
      default:
        return <DetectiveView 
          reactionItems={reactionItems}
          potentialAllergens={potentialAllergens}
          selectedAllergen={selectedAllergen}
          allergenDetails={allergenDetails}
          isParsing={isParsing}
          isFetchingDetails={isFetchingDetails}
          scannedData={scannedData}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleSelectAllergen={handleSelectAllergen}
        />;
    }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Header currentView={currentView} onNavigate={setCurrentView} />

          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
              </div>
          )}

          {renderView()}
          
        </div>
      </div>
      
      <button
        onClick={() => setIsScannerOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-110"
        aria-label="Open barcode scanner"
      >
        <BarcodeIcon className="h-7 w-7" />
      </button>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

export default App;
