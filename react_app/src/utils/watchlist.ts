const STORAGE_KEY = 'watchlist';

export const getWatchlist = (): number[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToWatchlist = (id: number) => {
  const list = getWatchlist();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};

export const removeFromWatchlist = (id: number) => {
  const list = getWatchlist().filter(i => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const isInWatchlist = (id: number): boolean =>
  getWatchlist().includes(id);