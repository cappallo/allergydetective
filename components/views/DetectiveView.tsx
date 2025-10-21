import React from 'react';
import ReactionInputForm from '../ReactionInputForm';
import ReactionList from '../ReactionList';
import AllergenAnalysis from '../AllergenAnalysis';
import type { ReactionItem, Allergen } from '../../types';

interface DetectiveViewProps {
  reactionItems: ReactionItem[];
  potentialAllergens: Allergen[];
  selectedAllergen: string | null;
  allergenDetails: string | null;
  isParsing: boolean;
  isFetchingDetails: boolean;
  scannedData: { name: string; ingredients: string } | null;
  handleAddItem: (name: string, rawIngredients: string) => void;
  handleRemoveItem: (id: string) => void;
  handleSelectAllergen: (allergenName: string) => void;
}

const DetectiveView: React.FC<DetectiveViewProps> = (props) => {
  const {
    reactionItems,
    potentialAllergens,
    selectedAllergen,
    allergenDetails,
    isParsing,
    isFetchingDetails,
    scannedData,
    handleAddItem,
    handleRemoveItem,
    handleSelectAllergen,
  } = props;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <aside className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Add Reaction Item</h2>
          <ReactionInputForm 
            onAddItem={handleAddItem} 
            isLoading={isParsing} 
            initialData={scannedData || undefined} 
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Your List</h2>
          <ReactionList items={reactionItems} onRemoveItem={handleRemoveItem} />
        </div>
      </aside>

      <section className="lg:col-span-3">
         <h2 className="text-lg font-semibold text-slate-800 mb-2">3. Analysis & Details</h2>
         <AllergenAnalysis 
          allergens={potentialAllergens}
          selectedAllergen={selectedAllergen}
          details={allergenDetails}
          isLoadingDetails={isFetchingDetails}
          onSelectAllergen={handleSelectAllergen}
        />
      </section>
    </main>
  );
};

export default DetectiveView;
