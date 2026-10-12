import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';

// Ліниве завантаження: код сторінки вантажиться лише при першому переході на неї.
const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Базовий шлях потрібен, коли застосунок лежить не в корені домену (GitHub Pages).
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || undefined;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'catalog', element: <CatalogPage /> },
        { path: 'city/:id', element: <DetailsPage /> },
        { path: 'favorites', element: <FavoritesPage /> },
        { path: 'about', element: <AboutPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename },
);
