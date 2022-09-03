import './bootstrap';
import '../sass/app.scss';

import React from 'react';
import ReactDOM from "react-dom/client";

import App from './components/App'

ReactDOM.createRoot(document.getElementById('app')).render(
    <App />
)
