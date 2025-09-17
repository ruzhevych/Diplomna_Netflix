import { useState } from "react";
import { useForgotPasswordMutation } from "../services/authApi";
import { toast } from "react-toastify";

interface Props {
  email: string;
}

const ChangePasswordRequest = ({ email }: Props) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      setStatus("sent");
      toast.success("An email with instructions has been sent to your address 📩");
    } catch (err: any) {
      toast.error(err?.data?.message || "Error sending the email");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-400">
        To change your password, an email with a link will be sent to your address{" "}
        <span className="text-lime-400">{email}</span>.
      </p>

      <button
        onClick={handleSend}
        disabled={isLoading || status === "sent"}
        className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : status === "sent" ? "Email sent ✅" : "Change password"}
      </button>
    </div>
  );
};

export default ChangePasswordRequest;