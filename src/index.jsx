import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // This imports the global index.css (optional but recommended)
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="320798123458-m1doftp0qc2v00647g7ta9smq74rcmr2.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);