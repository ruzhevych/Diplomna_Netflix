import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './router/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage'
import ProfilePage from './pages/ProfilePage';
import ChoosePlanPage from './pages/ChoosePlanPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  return (
    
    <Routes>
      
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose-plan" element={<ChoosePlanPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
};

export default App;