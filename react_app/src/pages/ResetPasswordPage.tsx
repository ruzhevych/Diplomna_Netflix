import { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../services/authApi";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../../public/logo-green.png"; // свій логотип

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await resetPassword({ email, token, newPassword }).unwrap();
      toast.success("Password successfully changed");
      navigate("/login");
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/public/login-bg.png')" }}
    >
      {/* Logo */}
      <div className="p-6">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/80 p-8 w-full max-w-sm">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-lime-400/80 text-black font-semibold py-3 rounded-sm hover:bg-lime-500 transition"
            >
              {isLoading ? "Please wait..." : "Change password"}
            </button>
          </form>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 bg-gray-700/80 text-white py-3 rounded-sm hover:bg-gray-600/80 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
