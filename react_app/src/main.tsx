// src/main.tsx (index.tsx)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { APP_ENV } from './env'
import { FilterProvider } from './context/FilterContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <FilterProvider>
              <App />
              <ToastContainer position="top-right" autoClose={3000} />
            </FilterProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
)
