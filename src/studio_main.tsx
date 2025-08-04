import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './studio_app.tsx';
import './index.css';
import { isElectron } from './lib/utils.ts';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing publishable key');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// Use contextBridge
if (isElectron() && window?.ipcRenderer?.on) {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
}