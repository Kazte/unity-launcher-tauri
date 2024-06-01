import './styles.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Remove the following line to disable dark mode
// to create a theme switcher, you have to follow
// the instructions at https://ui.shadcn.com/docs/dark-mode/vite
window.document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
