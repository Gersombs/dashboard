import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadRuntimeConfig } from './lib/config.ts';

async function initializeApp() {
  try {
    await loadRuntimeConfig();
    console.log('Configuracion de runtime cargada correctamente');
  } catch (error) {
    console.warn(
      'No se pudo cargar configuracion de runtime; usando valores por defecto:',
      error
    );
  }
 
  createRoot(document.getElementById('root')!).render(<App />);
}

initializeApp();
