// Picsum gives the same picture for the same seed, resized to the size we ask for, as WebP.
export const imageUrl = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}.webp`
