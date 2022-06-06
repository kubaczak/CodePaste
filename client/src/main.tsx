import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { SWRConfig } from 'swr';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SWRConfig
        value={{
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          fetcher: (resource, init) =>
            fetch(import.meta.env.VITE_API_URL + resource, init).then((res) =>
              res.json()
            ),
        }}
      >
        <App />
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>
);
