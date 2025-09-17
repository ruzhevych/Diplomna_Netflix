import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterState {
  ratingFrom: number;
  ratingTo: number;
  genres: number[];
}

interface FilterContextProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    ratingFrom: 1,
    ratingTo: 10,
    genres: [],
  });

  const clearFilters = () =>
    setFilters({ ratingFrom: 1, ratingTo: 10, genres: [] });

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
};
