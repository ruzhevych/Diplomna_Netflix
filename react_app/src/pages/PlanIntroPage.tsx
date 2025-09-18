import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../public/logo-green.png';
import { useTranslation } from 'react-i18next';

const PlanIntroPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state || {};

  const handleNext = () => {
    navigate('/choose-plan', { state: formData });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/login-bg.png')" }}
    >
      <div className="absolute left-96 top-8">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/70 p-10 w-full max-w-md text-center">
          <h2 className="text-white text-3xl font-bold mb-4 text-left">
            {t("planIntro.title")}
          </h2>
          <p className="text-gray-300 mb-2 text-left">
            {t("planIntro.point1")}
          </p>
          <p className="text-gray-300 mb-2 text-left">
            {t("planIntro.point2")}
          </p>
          <p className="text-gray-300 mb-6 text-left">
            {t("planIntro.point3")}
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-[#C4FF00]/90 text-black font-semibold py-3 rounded-sm hover:bg-lime-400/90 transition"
          >
            {t("planIntro.nextButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanIntroPage;