
import React from 'react';
import type { ReactionItem } from '../types';
import TrashIcon from './icons/TrashIcon';

interface ReactionListProps {
  items: ReactionItem[];
  onRemoveItem: (id: string) => void;
}

const ReactionList: React.FC<ReactionListProps> = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-slate-200">
        <p className="text-slate-500">Your added items will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex items-start justify-between animate-[fadeIn_0.3s_ease-out]"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{item.name}</h3>
            <p className="text-sm text-slate-500 mt-1 truncate" title={item.rawIngredients}>
              {item.rawIngredients}
            </p>
          </div>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="ml-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            aria-label={`Remove ${item.name}`}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
    </div>
  );
};

export default ReactionList;
