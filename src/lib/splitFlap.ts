export const normalizeSplitFlapWords = (
  words: readonly string[],
  padTo = 0,
) => {
  const safeWords = words.length ? words : [""];
  const length = Math.max(padTo, ...safeWords.map((word) => word.length));

  return safeWords.map((word) =>
    word.toUpperCase().padEnd(length, " ").slice(0, length),
  );
};
