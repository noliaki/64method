import { TEMPS, type Roast, type Taste } from "../lib/brew";

interface Props {
  taste: Taste;
  setTaste: (t: Taste) => void;
  later: 1 | 2 | 3;
  setLater: (n: 1 | 2 | 3) => void;
  roast: Roast;
  setRoast: (r: Roast) => void;
}

function Segment<T extends string | number>({
  title,
  hint,
  value,
  options,
  onChange,
}: {
  title: string;
  hint: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-base font-bold">{title}</h3>
        <p className="text-right text-xs text-ink-soft">{hint}</p>
      </div>
      <div className="grid auto-cols-fr grid-flow-col border border-ink">
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`px-2 py-2.5 text-sm transition-colors ${
                i > 0 ? "border-l border-ink" : ""
              } ${on ? "bg-ink text-paper" : "hover:bg-paper-deep"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Options({ taste, setTaste, later, setLater, roast, setRoast }: Props) {
  return (
    <div className="space-y-6">
      <Segment
        title="味わい"
        hint="前半40%の配分"
        value={taste}
        onChange={setTaste}
        options={[
          { value: "sweet", label: "甘め" },
          { value: "balanced", label: "標準" },
          { value: "bright", label: "明るめ" },
        ]}
      />
      <Segment
        title="濃さ"
        hint="後半60%の投数(粗挽きは3投)"
        value={later}
        onChange={setLater}
        options={[
          { value: 1 as const, label: "1投 · 軽め" },
          { value: 2 as const, label: "2投 · 濃いめ" },
          { value: 3 as const, label: "3投 · 基本" },
        ]}
      />
      <Segment
        title="焙煎度"
        hint={`湯温 ${TEMPS[roast]}℃${roast === "dark" ? " · 後半は2投もおすすめ" : ""}`}
        value={roast}
        onChange={setRoast}
        options={[
          { value: "light", label: "浅煎り" },
          { value: "medium", label: "中煎り" },
          { value: "dark", label: "深煎り" },
        ]}
      />
    </div>
  );
}
