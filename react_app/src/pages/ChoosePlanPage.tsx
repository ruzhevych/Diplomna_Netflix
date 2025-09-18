import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleRegisterMutation, useRegisterMutation } from "../services/authApi";
import { toast } from "react-toastify";
import logo from "../../public/logo-green.png";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    nameKey: "basic",
    price: "4,99 EUR",
    qualityKey: "good",
    resolution: "720p (HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 1,
    downloads: 1,
  },
  {
    nameKey: "standard",
    price: "7,49 EUR",
    qualityKey: "great",
    resolution: "1080p (Full HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 2,
    downloads: 2,
  },
  {
    nameKey: "premium",
    price: "9,99 EUR",
    qualityKey: "best",
    resolution: "4K (Ultra HD) + HDR",
    extraKey: "spatialAudioExtra",
    devices: "TV, computer, mobile phone, tablet",
    streams: 4,
    downloads: 6,
  },
];

const ChoosePlanPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email, password } = location.state || {};
  const [selectedPlan, setSelectedPlan] = useState("");
  const [error, setError] = useState("");
  const { googleTempToken, setGoogleTempToken, login: loginContext } = useAuth();
  const [register] = useRegisterMutation();
  const [googleRegister, { isLoading }] = useGoogleRegisterMutation();

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError(t("choosePlan.errors.noPlanSelected"));
      return;
    }
    setError("");

    try {
      let res;

      if (googleTempToken) {
        const payload = { googleAccessToken: googleTempToken, subscriptionType: selectedPlan };
        res = await googleRegister(payload).unwrap();

        loginContext(res.accessToken);
        setGoogleTempToken(null);
        toast.success(t("choosePlan.toast.googleRegisterSuccess"));
        navigate("/home");
        return;
      }

      if (fullName && email && password) {
        const res = await register({ fullName, email, password, plan: selectedPlan }).unwrap();
        loginContext(res.accessToken);
        toast.success(t("choosePlan.toast.registerSuccess"));
        navigate("/home");
        return;
      }

      toast.error(t("choosePlan.errors.invalidFlow"));
      navigate("/register");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err?.data?.message || t("choosePlan.errors.somethingWentWrong"));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/login-bg.png')" }}
    >
      <div className="flex justify-between items-center py-6 px-16">
        <img src={logo} alt="logo" className="w-32" />
        <button
          onClick={() => navigate(-1)}
          className="text-white font-bold hover:underline"
        >
          {t("choosePlan.backButton")}
        </button>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="px-4 py-2 inline-block w-full text-white rounded-lg font-semibold text-2xl mb-2 bg-gradient-to-r from-[#C4FF00]/60 to-[#C4FF00]/0">
          {t("choosePlan.title")}
        </h2>
        <div className="grid py-3 grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              onClick={() => setSelectedPlan(plan.nameKey)}
              className={`cursor-pointer bg-[#191716]/80 text-white p-3 rounded-lg transition border-2 ${
                selectedPlan === plan.nameKey ? "border-[#C4FF00]/50" : "border-transparent"
              }`}
            >
              <div className="bg-gradient-to-r bg-[#C4FF00]/20 to-lime-600/50 text-white px-6 pt-2 pb-1 rounded-md w-full mb-2">
                <h3 className="font-semibold text-lg">{t(`choosePlan.plans.${plan.nameKey}.name`)}</h3>
                <p className="text-lm text-gray-100 opacity-90 mb-2">
                  {plan.resolution}
                </p>
              </div>
              <p className="mb-2 px-3">
                <span className="font-semibold">{t("choosePlan.labels.price")}</span> <br />
                {plan.price}
              </p>
              <p className="mb-2 px-3">
                <span className="font-semibold">{t("choosePlan.labels.quality")}</span> <br />
                {t(`choosePlan.plans.${plan.nameKey}.quality`)}
              </p>
              <p className="mb-2 px-3">
                <span className="font-semibold">{t("choosePlan.labels.resolution")}</span> <br />
                {plan.resolution}
              </p>
              {plan.extraKey && (
                <p className="mb-2 px-3">
                  <span className="font-semibold">{t("choosePlan.labels.extra")}</span> <br />
                  {t(`choosePlan.labels.${plan.extraKey}`)}
                </p>
              )}
              <p className="mb-2 px-3">
                <span className="font-semibold">{t("choosePlan.labels.devices")}</span> <br />
                {plan.devices}
              </p>
              <p className="mb-2 px-3">
                <span className="font-semibold">
                  {t("choosePlan.labels.streams")}
                </span>{" "}
                <br />
                {plan.streams}
              </p>
              <p className=" px-3">
                <span className="font-semibold">{t("choosePlan.labels.downloads")}</span> <br />
                {plan.downloads}
              </p>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r w-full from-green-600/0 to-[#C4FF00]/60 text-2xl text-white font-semibold px-8 py-2 rounded-lg text-right"
          >
            {isLoading ? t("choosePlan.buttons.loading") : t("choosePlan.buttons.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;