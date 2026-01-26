
import React, { useState, useEffect, useRef } from 'react';
import { AppState, AppView, Recipe, Ingredient } from './types';
import { Layout } from './components/Layout';
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ScannerView from './views/ScannerView';
import ResultsView from './views/ResultsView';
import RecipeDetailView from './views/RecipeDetailView';
import FavoritesView from './views/FavoritesView';
import HistoryView from './views/HistoryView';
import ProfileView from './views/ProfileView';
import ExploreView from './views/ExploreView';
import RecipeLoadingView from './views/RecipeLoadingView';
import NotificationsView from './views/NotificationsView';
import AIChatbot from './components/AIChatbot';
import { generateRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    currentView: 'landing',
    scannedIngredients: [],
    recentRecipes: [],
    favoriteRecipes: [],
    history: []
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [lastUsedIngredients, setLastUsedIngredients] = useState<string[]>([]);
  const [lastUsedPortions, setLastUsedPortions] = useState<number>(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isAIFinished, setIsAIFinished] = useState(false);

  const navigateTo = (view: AppView) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const handleLogin = (user: any) => {
    setState(prev => ({ ...prev, user, currentView: 'dashboard' }));
  };

  const handleScanComplete = (ingredients: string[]) => {
    setState(prev => ({ ...prev, scannedIngredients: ingredients }));
  };

  const handleStartGeneration = async (ingredients: string[], portions: number) => {
    setLastUsedIngredients(ingredients);
    setLastUsedPortions(portions);
    setIsAIFinished(false);
    navigateTo('loading-recipes');

    try {
      const recipes = await generateRecipes(ingredients, portions);
      setIsAIFinished(true);
      
      // Delay slightly for dramatic effect of 100% progress
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          recentRecipes: recipes, 
          currentView: 'results',
          history: [
            { 
              ingredient: ingredients[0] || "Manual", 
              recipe: recipes[0]?.title || "Exploración",
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              imageUrl: recipes[0]?.imageUrl
            },
            ...prev.history
          ]
        }));
      }, 800);
    } catch (error) {
      console.error("Error generating recipes:", error);
      navigateTo('dashboard');
    }
  };

  const handleGenerateMore = async () => {
    if (state.recentRecipes.length >= 15 || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const moreRecipes = await generateRecipes(lastUsedIngredients, lastUsedPortions);
      setState(prev => ({
        ...prev,
        recentRecipes: [...prev.recentRecipes, ...moreRecipes].slice(0, 15)
      }));
    } catch (error) {
      console.error("Error generating more recipes:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    navigateTo('recipe-detail');
  };

  const toggleFavorite = (recipe: Recipe) => {
    setState(prev => {
      const isFavorite = prev.favoriteRecipes.some(r => r.id === recipe.id);
      if (isFavorite) {
        return { ...prev, favoriteRecipes: prev.favoriteRecipes.filter(r => r.id !== recipe.id) };
      } else {
        return { ...prev, favoriteRecipes: [...prev.favoriteRecipes, recipe] };
      }
    });
  };

  // Content Switching
  const renderView = () => {
    switch (state.currentView) {
      case 'landing':
        return <LandingView onStart={() => navigateTo('login')} />;
      case 'login':
        return <LoginView onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Layout activeNav="dashboard" onNavClick={navigateTo}>
            <DashboardView 
              user={state.user} 
              recentRecipes={state.recentRecipes}
              onScanClick={() => navigateTo('scanner')}
              onRecipeClick={handleSelectRecipe}
              onGenerate={() => {}}
              onStartGeneration={handleStartGeneration}
              onExploreClick={() => navigateTo('explore')}
              onNotificationsClick={() => navigateTo('notifications')}
            />
          </Layout>
        );
      case 'notifications':
        return (
          <Layout activeNav="dashboard" onNavClick={navigateTo}>
            <NotificationsView onBack={() => navigateTo('dashboard')} />
          </Layout>
        );
      case 'loading-recipes':
        return (
          <RecipeLoadingView 
            isFinished={isAIFinished} 
            onCancel={() => navigateTo('dashboard')} 
          />
        );
      case 'explore':
        return (
          <Layout activeNav="dashboard" onNavClick={navigateTo}>
            <ExploreView 
              onBack={() => navigateTo('dashboard')} 
              onRecipeClick={handleSelectRecipe}
            />
          </Layout>
        );
      case 'scanner':
        return (
          <ScannerView 
            onCancel={() => navigateTo('dashboard')} 
            onComplete={handleScanComplete}
            onReadyToGenerate={() => navigateTo('dashboard')}
          />
        );
      case 'results':
        return (
          <Layout activeNav="dashboard" onNavClick={navigateTo}>
            <ResultsView 
              recipes={state.recentRecipes} 
              onRecipeClick={handleSelectRecipe}
              onBack={() => navigateTo('dashboard')}
              isPremium={state.user?.isPremium}
              onGenerateMore={handleGenerateMore}
              loadingMore={loadingMore}
            />
          </Layout>
        );
      case 'recipe-detail':
        return (
          <RecipeDetailView 
            recipe={selectedRecipe} 
            isFavorite={state.favoriteRecipes.some(r => r.id === selectedRecipe?.id)}
            onToggleFavorite={() => selectedRecipe && toggleFavorite(selectedRecipe)}
            onBack={() => navigateTo(state.recentRecipes.length > 0 ? 'results' : 'explore')} 
            isPremium={state.user?.isPremium}
          />
        );
      case 'favorites':
        return (
          <Layout activeNav="favorites" onNavClick={navigateTo}>
            <FavoritesView 
              recipes={state.favoriteRecipes} 
              onRecipeClick={handleSelectRecipe}
            />
          </Layout>
        );
      case 'history':
        return (
          <Layout activeNav="history" onNavClick={navigateTo}>
            <HistoryView history={state.history} />
          </Layout>
        );
      case 'profile':
        return (
          <Layout activeNav="profile" onNavClick={navigateTo}>
            <ProfileView user={state.user} onLogout={() => navigateTo('landing')} />
          </Layout>
        );
      default:
        return <div>View not implemented</div>;
    }
  };

  const showChatbot = !['landing', 'login', 'scanner', 'loading-recipes'].includes(state.currentView);

  return (
    <div className="min-h-screen text-white">
      {renderView()}
      {showChatbot && <AIChatbot />}
    </div>
  );
};

export default App;
