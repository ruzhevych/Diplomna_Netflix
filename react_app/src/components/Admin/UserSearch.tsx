import { useState, useEffect } from "react";

interface UserSearchProps {
  onSearch: (value: string) => void;
}

export default function UserSearch({ onSearch }: UserSearchProps) {
  const [value, setValue] = useState("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value.trim());
    }, 500); // debounce 0.5s
    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Пошук за email чи ім'ям..."
      className="w-full  px-4 py-2 rounded-sm bg-gray-700/30 text-white focus:outline-none focus:ring focus:ring-red-500/50"
    />
  );
}
