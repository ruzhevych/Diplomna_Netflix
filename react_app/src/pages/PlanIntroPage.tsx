import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../public/logo-green.png';

const PlanIntroPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const formData = location.state || {};

  const handleNext = () => {
    navigate('/choose-plan', { state: formData });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/public/login-bg.png')" }}
    >
      {/* Логотип */}
      <div className="p-6">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      {/* Контент */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/70 p-8 w-full max-w-sm text-center">
          <h2 className="text-white text-3xl font-bold mb-4 text-left">
            Choose your tariff plan
          </h2>
          <p className="text-gray-300 mb-2 text-left">
           ♦ Start easily — stop whenever you want.
          </p>
          <p className="text-gray-300 mb-2 text-left">
            ♦ Thousands of shows and movies with one subscription.
          </p>
          <p className="text-gray-300 mb-6 text-left">
            ♦ Watch anywhere, anytime, on any screen.
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-lime-500 text-black font-semibold py-3 rounded-sm hover:bg-lime-400/90 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanIntroPage;
