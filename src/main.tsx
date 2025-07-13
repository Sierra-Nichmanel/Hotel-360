
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { seedDatabase } from './lib/db';
import * as serviceWorkerRegistration from './service-worker-registration';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: false,
    },
  },
});

// Seed the database with initial data if needed
seedDatabase().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Register the service worker for offline functionality
serviceWorkerRegistration.register({
  onSuccess: () => console.log('Service worker registered successfully for offline usage'),
  onUpdate: () => console.log('New content available; please refresh the page'),
});
