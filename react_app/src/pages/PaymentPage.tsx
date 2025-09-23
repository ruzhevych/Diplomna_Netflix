import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddCardMutation } from "../services/paymentApi";
import { useRegisterMutation, useGoogleRegisterMutation, useLoginMutation } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import logo from "../../public/logo-green.png";
import { useAddSubscriptionMutation } from "../services/subscriptionApi";

const plans: Record<string, { price: string; label: string }> = {
  basic: { price: "4,99 EUR/month", label: "Basic" },
  standard: { price: "7,49 EUR/month", label: "Standard" },
  premium: { price: "9,99 EUR/month", label: "Premium" },
};

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpiryMonth] = useState(0);
  const [expYear, setExpiryYear] = useState(0);
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // сюди передаємо всі дані з ChoosePlanPage
  const { selectedPlan, fullName, email, password, googleTempToken } = location.state || {};

  const planInfo = selectedPlan ? plans[selectedPlan.toLowerCase()] : null;

  const { login: loginContext, setGoogleTempToken, isAuthenticated } = useAuth();

  const [createCard, { isLoading: isCardLoading }] = useAddCardMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, {isLoading: isLoginLoading}] = useLoginMutation();
  const [addSub] = useAddSubscriptionMutation();
  const [googleRegister, { isLoading: isGoogleLoading }] = useGoogleRegisterMutation();

  const formatPlanType = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "basic":
        return "Basic";
      case "standard":
        return "Standard";
      case "premium":
        return "Premium";
      default:
        return plan;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      navigate("/choose-plan");
      return;
    }

    try {

      if(!isAuthenticated){
        // 1. виконуємо реєстрацію (google або звичайну)
        let res;
        if (googleTempToken) {
          res = await googleRegister({
            googleAccessToken: googleTempToken,
            subscriptionType: selectedPlan,
          }).unwrap();
          setGoogleTempToken(null);
        } else if (fullName && email && password) {
          res = await register({
            fullName,
            email,
            password,
            plan: selectedPlan,
          }).unwrap();
        } else {
          toast.error("Invalid registration flow");
          navigate("/register");
          return;
        }

        // 2. логін
        loginContext(res.accessToken);

        // 3. зберігаємо карту
        await createCard({
          cardNumber,
          expMonth,
          expYear,
          cvv,
          cardholderName,
          makeDefault,
        }).unwrap();

        toast.success("Registration completed!");
        navigate("/home");
      } else {
        await addSub({ type: formatPlanType(selectedPlan) }).unwrap();

        await createCard({
          cardNumber,
          expMonth,
          expYear,
          cvv,
          cardholderName,
          makeDefault,
        }).unwrap();

        toast.success("Payment method successfully added");
        navigate("/home");
      }
    } catch (err: any) {
      console.error("Payment/Register error:", err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/public/login-bg.png')",
      }}
    >
      {/* Лого */}
      <div className="absolute left-96 top-8">
        <img src={logo} alt="logo" className="l-10 w-32" />
      </div>

      {/* Форма */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/70 rounded-sm py-8 px-10 w-full max-w-md">
          <h2 className="text-white text-2xl font-bold mb-6 text-left">
            Set up your credit or debit card
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Card number"
              className="w-full p-3 rounded-sm bg-[#191716]/80 border border-gray-500 text-white"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />

            <div className="flex space-x-2">
              <div className="flex space-x-2 w-1/2">
                <input
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  className="w-1/2 p-3 rounded-sm bg-[#191716]/80 border border-gray-500 text-white"
                  value={expMonth || ""}
                  onChange={(e) => setExpiryMonth(Number(e.target.value))}
                  required
                />
                <input
                  type="number"
                  placeholder="YY"
                  min="24"
                  max="99"
                  className="w-1/2 p-3 rounded-sm bg-[#191716]/80 border border-gray-500 text-white"
                  value={expYear || ""}
                  onChange={(e) => setExpiryYear(Number(e.target.value))}
                  required
                />
              </div>

              <input
                type="password"
                placeholder="CVV"
                className="w-1/2 p-3 rounded-sm bg-[#191716]/80 border border-gray-500 text-white"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Name on card"
              className="w-full p-3 rounded-sm bg-[#191716]/80 border border-gray-500 text-white"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />

            {/* Subscription info */}
            {planInfo && (
              <div className="flex items-center justify-between bg-[#191716]/80 text-white p-3 rounded-sm">
                <span>
                  <b>{planInfo.price}</b> <br /> {planInfo.label}
                </span>
                <button
                  type="button"
                  className="text-[#C4FF00] font-bold hover:underline"
                  onClick={() =>
                    navigate("/choose-plan", {
                      state: { fullName, email, password, googleTempToken },
                    })
                  }
                >
                  Change
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#C4FF00]/90 text-black text-xl font-bold py-2.5 rounded-sm hover:bg-[#C4FF00] transition"
              disabled={isCardLoading || isRegisterLoading || isGoogleLoading}
            >
              {isCardLoading || isRegisterLoading || isGoogleLoading
                ? "Please wait..."
                : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
