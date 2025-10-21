import React, { useState } from 'react';
import { getIngredientInfo } from '../../services/geminiService';
import SpinnerIcon from '../icons/SpinnerIcon';

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

const DatabaseView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedTerm, setSearchedTerm] = useState<string>('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);
        setSearchedTerm(searchTerm);
        try {
            const info = await getIngredientInfo(searchTerm);
            setResult(info);
        } catch (err) {
            console.error("Database search error:", err);
            setError("Failed to fetch information. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Ingredient & Compound Database</h2>
                <p className="text-slate-600 mb-6">Enter the name of an ingredient or chemical compound to learn more about its common uses and potential allergenic properties.</p>
                <form onSubmit={handleSearch}>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., Sodium Benzoate, Soy Lecithin..."
                            className="flex-1 w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8">
                {error && <p className="text-center text-red-600">{error}</p>}
                
                {!isLoading && !result && !error && (
                    <div className="text-center py-10 px-4">
                        <p className="text-slate-500">Search results will appear here.</p>
                    </div>
                )}
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <SpinnerIcon className="h-8 w-8 text-indigo-600 animate-spin mb-4"/>
                        <p className="text-slate-500">Fetching information for <strong className="text-slate-600">{searchedTerm}</strong>...</p>
                    </div>
                )}
                
                {result && (
                    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 animate-[fadeIn_0.5s_ease-out]">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 capitalize">{searchedTerm}</h3>
                        <SimpleMarkdownRenderer content={result} />
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </main>
    );
};

export default DatabaseView;
