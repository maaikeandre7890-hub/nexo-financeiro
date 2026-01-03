import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';

// 🔥 GATILHO DE BUILD (NÃO REMOVER)
const BUILD_ID = Date.now();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        {/* marcador invisível de build */}
        <span style={{ display: 'none' }}>build-{BUILD_ID}</span>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
);
