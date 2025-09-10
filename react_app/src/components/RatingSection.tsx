import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/hooks";
import { useAddRatingMutation, useGetUserRatingQuery } from "../services/ratingApi";

interface Props {
  contentId: number;
  contentType: string;
}

export default function RatingSection({ contentId, contentType }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const currentUser = useAppSelector((state) => state.user.user);
  const [addRating] = useAddRatingMutation();

  async function handleRatingClick(stars: number) {
    setSelected(stars);
    try {
      await addRating({ contentId, contentType, stars }).unwrap();
      toast.success(`Ви поставили оцінку ${stars} ⭐`);
    } catch (err) {
      toast.error("Помилка при збереженні оцінки");
    }
  }

  return (
    <div className="max-w-6xl mx-auto gap-8 mt-20 my-6">
      <h3 className="text-lg font-semibold mb-3">Залиште свою оцінку</h3>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={32}
            className={`cursor-pointer transition-colors ${
              (hover ?? selected ?? 0) >= star ? "text-yellow-400" : "text-gray-500"
            }`}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-sm text-gray-400">
          Ваша оцінка: {selected} / 5
        </p>
      )}
    </div>
  );
}
