import type { Source } from "../lib/brew";

interface Props {
  source: Source;
  text: string;
  values: Record<Source, string>;
  ratio: string;
  onChange: (source: Source, text: string) => void;
  onRatioChange: (ratio: string) => void;
}

const FIELDS: { key: Source; label: string; en: string }[] = [
  { key: "dose", label: "粉", en: "Coffee" },
  { key: "water", label: "お湯", en: "Water" },
];

export default function AmountInputs({
  source,
  text,
  values,
  ratio,
  onChange,
  onRatioChange,
}: Props) {
  return (
    <>
      <div className="divide-y divide-rule border-y border-rule">
        {FIELDS.map((f) => {
          const active = source === f.key;
          return (
            <label
              key={f.key}
              className="group flex cursor-text items-baseline justify-between gap-4 py-5"
            >
              <span className="flex shrink-0 flex-col">
                <span className="font-display text-lg font-bold">{f.label}</span>
                <span className="font-numeral text-sm italic text-ink-soft">
                  {f.en}
                  {active ? " · 入力中" : " · 自動計算"}
                </span>
              </span>
              <span className="flex min-w-0 flex-1 items-baseline justify-end gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={active ? text : values[f.key]}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder="0"
                  className={`w-full min-w-0 max-w-64 border-b-2 bg-transparent text-right font-numeral text-5xl leading-none sm:text-6xl tabular-nums outline-none transition-colors placeholder:text-ink/20 focus:border-roast ${
                    active ? "border-roast text-roast-deep" : "border-transparent text-ink/70"
                  }`}
                />
                <span className="font-numeral text-xl italic text-ink-soft">g</span>
              </span>
            </label>
          );
        })}
      </div>
      <label className="mt-4 flex items-center justify-between gap-4">
        <span>
          <span className="font-display text-sm font-bold">粉とお湯の比率</span>
          <span className="ml-2 font-numeral text-xs italic text-ink-soft">Ratio</span>
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-numeral text-sm text-ink-soft">1 :</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.1"
            step="0.1"
            value={ratio}
            onChange={(e) => onRatioChange(e.target.value)}
            aria-label="お湯の倍率"
            className="w-20 border-b-2 border-roast bg-transparent text-right font-numeral text-2xl tabular-nums text-roast-deep outline-none"
          />
        </span>
      </label>
    </>
  );
}
