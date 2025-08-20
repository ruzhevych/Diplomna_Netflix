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
import MovieDetailsPage from './pages/MovieDetailsPage';
import MoviesPage from './pages/Categories/MoviesPage';
// import AnimePage from './pages/Categories/AnimePage';
// import SeriesPage from './pages/Categories/SeriesPage';
// import NewPage from './pages/Categories/NewPage';
// import CartoonsPage from './pages/Categories/CartoonsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PlanIntroPage from './pages/PlanIntroPage';


const App = () => {
  return (
    
    <Routes>
      
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/choose-plan" element={<ChoosePlanPage />} />
        <Route path="/plan-intro" element={<PlanIntroPage />} />

        <Route path="/movies" element={<MoviesPage />} />
        {/* <Route path="/anime" element={<AnimePage />} />
        <Route path="/tvseries" element={<SeriesPage />} /> */}
        {/* <Route path="/cartoons" element={<CartoonsPage />} />
        <Route path="/newandpopular" element={<NewPage />} /> */}

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
        path="/movie/:id"
        element={
          <ProtectedRoute>
            <MovieDetailsPage />
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