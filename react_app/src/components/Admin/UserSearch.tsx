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
      className="w-full md:w-80 px-4 py-2 rounded-xl bg-[#1f1f1f] text-white border border-white/10 focus:outline-none focus:ring focus:ring-red-500/50"
    />
  );
}
