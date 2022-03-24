export const softmax = (logits: any) => {
  const maxLogit = Math.max(...logits);
  const scores = logits.map((l: number) => Math.exp(l - maxLogit));
  const denom = scores.reduce((a: number, b: number) => a + b);
  return scores.map((s: number) => s / denom);
};

export const sigmoid = (x: any) => Math.exp(x) / (Math.exp(x) + 1);
