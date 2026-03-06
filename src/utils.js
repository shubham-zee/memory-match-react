export const EMOJIS = [
  "🍕",
  "🍩",
  "🍎",
  "🍇",
  "🍪",
  "🍫",
  "🍔",
  "🌮",
  "🥑",
  "🍓",
  "🍰",
  "🍉",
];

export function createDeck(size = 8) {
  // pick 'size' emojis, duplicate them, assign id, and shuffle
  const picks = EMOJIS.slice(0, size);
  const deck = picks.flatMap((e) => [
    { id: crypto.randomUUID(), emoji: e, matched: false },
    { id: crypto.randomUUID(), emoji: e, matched: false },
  ]);
  return shuffle(deck);
}

export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
