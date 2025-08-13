import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
import { store } from './store/store.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { APP_ENV } from './env/index.ts';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <App/>
            <ToastContainer position="top-right" autoClose={3000} />
          </GoogleOAuthProvider>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)