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
import AnimePage from './pages/Categories/AnimePage';
import SeriesPage from './pages/Categories/SeriesPage';
import NewPage from './pages/Categories/NewPage';
import CartoonsPage from './pages/Categories/CartoonsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PlanIntroPage from './pages/PlanIntroPage';
import FavoritesPage from "./pages/Categories/FavoritesPage.tsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.tsx"
import AdminRoute from "./components/Admin/AdminRoute.tsx"
import BlockedPage from "./pages/BlockedPage"
import SerisesDetailsPage from './pages/SeriesDetailPage.tsx';
import ForLaterPage from './pages/Categories/ForLaterPage.tsx';
import MovieCollection from './pages/MovieCollection.tsx';
import MovieHistoryPage from './pages/Categories/MovieHistoryPage.tsx';
import PaymentPage from './pages/PaymentPage.tsx'

const App = () => {
  return (
    
    <Routes>
        <Route path="/blocked" element={<BlockedPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute>
          <AdminDashboardPage />
          </AdminRoute>} 
          />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/choose-plan" element={<ChoosePlanPage />} />
        <Route path="/plan-intro" element={<PlanIntroPage />} />
        <Route path="/payment" element={<PaymentPage/>}></Route>

        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/anime" element={<AnimePage />} />
        <Route path="/tvseries" element={<SeriesPage />} /> 
        <Route path="/cartoons" element={<CartoonsPage />} />
        <Route path="/newandpopular" element={<NewPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/for-later" element={<ForLaterPage />} />
        <Route path="/movie/history" element={<MovieHistoryPage />} />

        {/* <Route path="/profile/edit" element={<ProfileEditPage />} />  */}

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
        path="/tv/:id"
        element={
          <ProtectedRoute>
            <SerisesDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collection/:id"
        element={
          <ProtectedRoute>
            <MovieCollection />
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