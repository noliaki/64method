export type Source = "dose" | "water";
export type Taste = "sweet" | "balanced" | "bright";
export type Roast = "light" | "medium" | "dark";

export const RATIO = 15;

export interface Amounts {
  dose: number;
  water: number;
}

export function computeAmounts(source: Source, value: number, ratio = RATIO): Amounts {
  const dose = source === "dose" ? value : value / ratio;
  return { dose, water: dose * ratio };
}

export interface Pour {
  index: number;
  at: number;
  amount: number;
  total: number;
  phase: "taste" | "strength";
}

const FIRST_SHARE: Record<Taste, number> = {
  sweet: 0.42,
  balanced: 0.5,
  bright: 0.58,
};
const START_TIMES = [0, 45, 90, 130, 160];

export function buildPours(
  water: number,
  taste: Taste,
  laterPours: 1 | 2 | 3,
): { pours: Pour[]; endAt: number } {
  const w = Math.round(water);
  const early = w * 0.4;
  const late = w - early;
  const raw = [
    early * FIRST_SHARE[taste],
    early * (1 - FIRST_SHARE[taste]),
    ...Array.from({ length: laterPours }, () => late / laterPours),
  ];
  const amounts = raw.map((a) => Math.round(a));
  const drift = w - amounts.reduce((s, a) => s + a, 0);
  amounts[amounts.length - 1] += drift;

  let total = 0;
  const pours = amounts.map((amount, i) => {
    total += amount;
    return {
      index: i + 1,
      at: START_TIMES[i],
      amount,
      total,
      phase: (i < 2 ? "taste" : "strength") as Pour["phase"],
    };
  });
  return { pours, endAt: pours[pours.length - 1].at + 50 };
}

export const TEMPS: Record<Roast, number> = { light: 93, medium: 88, dark: 83 };

export function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function fmtNum(n: number) {
  if (!isFinite(n)) return "";
  return String(Math.round(n * 10) / 10);
}
