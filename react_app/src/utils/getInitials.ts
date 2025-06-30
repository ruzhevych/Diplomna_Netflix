export const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.map(p => p[0].toUpperCase()).join('').slice(0, 2);
};