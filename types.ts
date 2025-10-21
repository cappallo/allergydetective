export interface ReactionItem {
  id: string;
  name: string;
  ingredients: string[];
  rawIngredients: string;
}

export interface Allergen {
  name: string;
  count: number;
  items: string[];
}

export interface LogEntry {
  id: string;
  name: string;
  symptoms: string;
  date: string; // ISO string
}

export type View = 'detective' | 'log' | 'database';