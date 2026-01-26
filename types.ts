
export interface Ingredient {
  name: string;
  confidence: number;
  properties: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  portions: number;
  prepTime: string;
  difficulty: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  matchPercentage: number;
  category?: 'Vegano' | 'Rápido' | 'Keto' | 'Todos';
}

export type AppView = 'landing' | 'login' | 'dashboard' | 'scanner' | 'results' | 'favorites' | 'history' | 'profile' | 'recipe-detail' | 'explore' | 'loading-recipes' | 'notifications';

export interface AppState {
  user: {
    name: string;
    isPremium: boolean;
    email: string;
  } | null;
  currentView: AppView;
  scannedIngredients: string[];
  recentRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  history: {
    ingredient: string;
    recipe: string;
    date: string;
    time: string;
    imageUrl?: string;
  }[];
}
