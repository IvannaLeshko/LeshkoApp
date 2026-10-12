import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

/** Компоненти працюють з обраним лише через цей хук, а не з контекстом напряму. */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites потрібно викликати всередині FavoritesProvider');
  return context;
}
