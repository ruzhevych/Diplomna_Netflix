import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleRegisterMutation, useRegisterMutation} from "../services/authApi";
import { toast } from "react-toastify";
import logo from "../../public/logo-green.png";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    name: "Basic",
    price: "4,99 EUR",
    quality: "Good",
    resolution: "720p (HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 1,
    downloads: 1,
  },
  {
    name: "Standard",
    price: "7,49 EUR",
    quality: "Great",
    resolution: "1080p (Full HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 2,
    downloads: 2,
  },
  {
    name: "Premium",
    price: "9,99 EUR",
    quality: "Best",
    resolution: "4K (Ultra HD) + HDR",
    extra: "Spatial audio (immersive sound) Included",
    devices: "TV, computer, mobile phone, tablet",
    streams: 4,
    downloads: 6,
  },
];

const ChoosePlanPage = () => {
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
      setError("Please choose a plan");
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
        toast.success("Google registration successful!");
        navigate("/home");
        return;
      }

      if (fullName && email && password) {
        const res = await register({ fullName, email, password, plan: selectedPlan }).unwrap();
        loginContext(res.accessToken);
        toast.success("Registration successful!");
        navigate("/home");
        return;
      }

      toast.error("Invalid registration flow. Please try again.");
      navigate("/register");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err?.data?.message || "Something went wrong during registration");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      {/* Logo & Back */}
      <div className="flex justify-between items-center p-6">
        <img src={logo} alt="logo" className="w-32" />
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:underline"
        >
          Back
        </button>
      </div>

      {/* Title */}
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="px-4 py-2.5 inline-block w-full text-white rounded-sm font-semibold text-2xl mb-4 bg-gradient-to-r from-lime-600 to-green-600/0">
          Choose your tariff plan
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          onClick={() => setSelectedPlan(plan.name)}
          className={`cursor-pointer bg-black/80 text-white p-6 rounded-lg transition border-2 ${
            selectedPlan === plan.name ? "border-lime-400" : "border-transparent"
          }`}
        >
          
          <div className="bg-gradient-to-r from-lime-600/70 to-lime-600/50 text-white px-4 pt-2 pb-1 rounded-md w-full mb-3">
            <h3 className="font-semibold text-lg ">{plan.name}</h3>
            <p className="text-lm text-gray-100 opacity-90 ">
              {plan.name === "Basic" ? "720p" : plan.name === "Standard" ? "1080p" : "4K + HDR"}
            </p>
          </div>

          <p className="mb-2">
            <span className="font-semibold">Monthly price</span> <br />
            {plan.price}
          </p>

          <p className="mb-2">
            <span className="font-semibold">Video and sound quality</span> <br />
            {plan.quality}
          </p>

          <p className="mb-2">
            <span className="font-semibold">Resolution</span> <br />
            {plan.resolution}
          </p>

          {plan.extra && (
            <p className="mb-2">
              <span className="font-semibold">Spatial audio</span> <br />
              {plan.extra}
            </p>
          )}

          <p className="mb-2">
            <span className="font-semibold">Supported devices</span> <br />
            {plan.devices}
          </p>

          <p className="mb-2">
            <span className="font-semibold">
              Devices your household can watch at the same time
            </span>{" "}
            <br />
            {plan.streams}
          </p>

          <p>
            <span className="font-semibold">Download devices</span> <br />
            {plan.downloads}
          </p>
        </div>
      ))}
    </div>



        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r w-full from-green-600/0 to-lime-600 text-2xl text-white font-semibold px-8 py-2.5 rounded-sm text-right"
          >
            {isLoading ? "Please wait..." : "Next ➜"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;
