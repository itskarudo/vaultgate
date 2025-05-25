export const formatError = (msg: string): string => {
  const idx = msg.indexOf("] ");
  return idx !== -1 ? msg.slice(idx + 2) : msg;
};
