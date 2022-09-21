import React from 'react';
import ReactDom from 'react-dom/client';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootEl = document.getElementById('root');
const root = ReactDom.createRoot(rootEl);
root.render(<App />);
serviceWorkerRegistration.register();