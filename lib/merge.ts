export function merge<T>(a: T[], b: T[], predicate = (a: T, b: T) => a === b) {
  const c = [...a];
  b.forEach((bItem) =>
    c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)
  );
  return c;
}
