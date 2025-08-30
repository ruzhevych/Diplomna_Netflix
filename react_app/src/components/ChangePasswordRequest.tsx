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
      toast.success("Лист з інструкціями відправлено на вашу пошту 📩");
    } catch (err: any) {
      toast.error(err?.data?.message || "Помилка при відправці листа");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-400">
        Для зміни паролю на вашу пошту <span className="text-lime-400">{email}</span> буде відправлено лист із посиланням.
      </p>

      <button
        onClick={handleSend}
        disabled={isLoading || status === "sent"}
        className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Відправка..." : status === "sent" ? "Лист відправлено ✅" : "Змінити пароль"}
      </button>
    </div>
  );
};

export default ChangePasswordRequest;
