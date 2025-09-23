import { useState } from "react";
import type { CardDTO, CardUpdateDTO } from "../types/payment";

interface EditCardModalProps {
  card: CardDTO;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cardId: number, dto: CardUpdateDTO) => Promise<void>;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, isOpen, onClose, onUpdate }) => {
  const [cardholderName, setCardholderName] = useState(card.cardholderName);
  const [cardNumber, setCardNumber] = useState(card.cardNumber);
  const [expMonth, setExpiryMonth] = useState(card.expMonth);
  const [expYear, setExpiryYear] = useState(card.expYear);
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate(card.id, {
        cardNumber,
        cardholderName,
        expMonth,
        expYear,
        cvv,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#141414] rounded-lg p-6 w-full max-w-md text-white">
        <h3 className="text-xl font-semibold mb-4">Edit Card</h3>

        <div className="flex flex-col gap-3 mb-4">
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
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-lime-500 text-black rounded hover:bg-lime-400 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;

