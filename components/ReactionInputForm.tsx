import React, { useState, useEffect } from 'react';
import PlusIcon from './icons/PlusIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ReactionInputFormProps {
  onAddItem: (name: string, ingredients: string) => void;
  isLoading: boolean;
  initialData?: { name: string; ingredients: string };
}

const ReactionInputForm: React.FC<ReactionInputFormProps> = ({ onAddItem, isLoading, initialData }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(() => {
    if (initialData) {
        setName(initialData.name);
        setIngredients(initialData.ingredients);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ingredients.trim() || isLoading) return;
    onAddItem(name, ingredients);
    setName('');
    setIngredients('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="space-y-4">
        <div>
          <label htmlFor="item-name" className="block text-sm font-medium text-slate-700 mb-1">
            Product / Food Name
          </label>
          <input
            type="text"
            id="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Spicy Tuna Roll"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-slate-700 mb-1">
            Ingredients List
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Paste or type ingredients here, or use the barcode scanner."
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !name.trim() || !ingredients.trim()}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Analyzing...
          </>
        ) : (
          <>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Reaction Item
          </>
        )}
      </button>
    </form>
  );
};

export default ReactionInputForm;
