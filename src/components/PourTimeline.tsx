import { fmtTime, type Pour } from "../lib/brew";

interface Props {
  pours: Pour[];
  endAt: number;
  water: number;
  elapsed: number;
}

export default function PourTimeline({ pours, endAt, water, elapsed }: Props) {
  const current = pours.reduce((c, p, i) => (elapsed >= p.at ? i : c), -1);
  const finished = elapsed >= endAt;

  return (
    <ol className="relative">
      {pours.map((p, i) => {
        const on = i === current && !finished;
        const pct = water > 0 ? (p.total / water) * 100 : 0;
        return (
          <li
            key={p.index}
            className={`relative grid grid-cols-[4.5rem_1fr] gap-4 border-t border-rule py-5 transition-colors sm:grid-cols-[5.5rem_1fr_auto] ${
              on ? "bg-roast/10" : ""
            }`}
          >
            <div className="font-numeral text-3xl tabular-nums leading-none">
              {fmtTime(p.at)}
              <div className="mt-2 font-sans text-[11px] tracking-widest text-ink-soft">
                {p.index}投目
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-numeral text-5xl tabular-nums leading-none text-roast-deep">
                  {p.amount}
                </span>
                <span className="font-numeral text-lg italic text-ink-soft">g</span>
                <span className="ml-2 border border-roast/60 px-1.5 py-0.5 text-[11px] text-roast">
                  {p.phase === "taste" ? "味を決める 40%" : "濃さを決める 60%"}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-ink/10">
                <div
                  className="h-full bg-roast transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-soft sm:hidden">
                累計 {p.total}g
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <div className="font-numeral text-2xl tabular-nums">{p.total}</div>
              <div className="text-[11px] tracking-widest text-ink-soft">累計 g</div>
            </div>
          </li>
        );
      })}
      <li
        className={`grid grid-cols-[4.5rem_1fr] gap-4 border-y border-ink py-5 sm:grid-cols-[5.5rem_1fr_auto] ${
          finished ? "bg-roast/10" : ""
        }`}
      >
        <div className="font-numeral text-3xl tabular-nums leading-none">
          {fmtTime(endAt)}
        </div>
        <div className="font-display text-lg font-bold">ドリッパーを外す</div>
      </li>
    </ol>
  );
}
