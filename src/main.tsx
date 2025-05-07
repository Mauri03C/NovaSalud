
import React from 'react'; // Explicit React import
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with React explicitly passed
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
