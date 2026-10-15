import { useEffect, useMemo, useState } from "react";
import AmountInputs from "./components/AmountInputs";
import Options from "./components/Options";
import PourTimeline from "./components/PourTimeline";
import {
  buildPours,
  computeAmounts,
  fmtNum,
  fmtTime,
  type Roast,
  type Source,
  type Taste,
  TEMPS,
} from "./lib/brew";

export default function App() {
  const [source, setSource] = useState<Source>("dose");
  const [text, setText] = useState("20");
  const [ratioText, setRatioText] = useState("15");
  const [taste, setTaste] = useState<Taste>("balanced");
  const [later, setLater] = useState<1 | 2 | 3>(3);
  const [roast, setRoast] = useState<Roast>("medium");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const num = parseFloat(text);
  const ratio = parseFloat(ratioText);
  const valid = isFinite(num) && num > 0 && isFinite(ratio) && ratio > 0;
  const amounts = useMemo(
    () => computeAmounts(source, valid ? num : 0, valid ? ratio : 15),
    [source, num, ratio, valid],
  );
  const { pours, endAt } = useMemo(
    () => buildPours(amounts.water, taste, later),
    [amounts.water, taste, later],
  );

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && elapsed >= endAt) setRunning(false);
  }, [running, elapsed, endAt]);

  const values: Record<Source, string> = {
    dose: valid ? fmtNum(amounts.dose) : "",
    water: valid ? fmtNum(amounts.water) : "",
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-6 sm:px-10 lg:py-8">
      <header className="mb-8 grid gap-2 border-b-2 border-ink pb-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-numeral text-xs italic tracking-wide text-roast">
            The 4:6 Method — Tetsu Kasuya
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
            4：6メソッド 計算帖
          </h1>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-ink-soft">
          粉またはお湯の量を書き入れてください。もう一方の量と、注ぎ方の段取りをお知らせします。
        </p>
      </header>

      <main className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <section className="space-y-10">
          <div>
            <h2 className="mb-3 font-numeral text-xs uppercase tracking-[0.25em] text-ink-soft">
              01 — 分量
            </h2>
            <AmountInputs
              source={source}
              text={text}
              values={values}
              ratio={ratioText}
              onChange={(s, t) => {
                setSource(s);
                setText(t);
              }}
              onRatioChange={setRatioText}
            />
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              お湯は粉の{valid ? fmtNum(ratio) : "設定した"}倍で計算します。
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-numeral text-xs uppercase tracking-[0.25em] text-ink-soft">
              02 — 味の調整
            </h2>
            <Options
              taste={taste}
              setTaste={setTaste}
              later={later}
              setLater={setLater}
              roast={roast}
              setRoast={setRoast}
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="font-numeral text-xs uppercase tracking-[0.25em] text-ink-soft">
              03 — 注ぎ方
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-numeral text-3xl tabular-nums">
                {fmtTime(elapsed)}
              </span>
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="bg-roast px-4 py-2 text-sm text-paper transition-colors hover:bg-roast-deep"
              >
                {running ? "一時停止" : elapsed > 0 ? "再開" : "スタート"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  setElapsed(0);
                }}
                className="border border-ink px-4 py-2 text-sm transition-colors hover:bg-paper-deep"
              >
                リセット
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 border border-ink text-center">
            <Stat label="湯温" value={`${TEMPS[roast]}`} unit="℃" />
            <Stat label="総湯量" value={values.water || "–"} unit="g" bordered />
            <Stat label="1投の目安" value={fmtNum(amounts.dose * 3) || "–"} unit="g" bordered />
          </div>

          {valid ? (
            <PourTimeline
              pours={pours}
              endAt={endAt}
              water={Math.round(amounts.water)}
              elapsed={elapsed}
            />
          ) : (
            <p className="border-y border-rule py-12 text-center font-display text-lg text-ink-soft">
              量を入れると、ここに注ぎ方が現れます。
            </p>
          )}

          <p className="mt-6 text-xs leading-relaxed text-ink-soft">
            中粗挽き〜粗挽きで。前の湯がほぼ落ちきってから次を注ぎ、タイムに合わせて挽き目を調整してください。
            参考: Philocoffea「How to brew」
          </p>
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  bordered,
}: {
  label: string;
  value: string;
  unit: string;
  bordered?: boolean;
}) {
  return (
    <div className={`py-3 ${bordered ? "border-l border-ink" : ""}`}>
      <div className="text-[11px] tracking-widest text-ink-soft">{label}</div>
      <div className="font-numeral text-2xl tabular-nums">
        {value}
        <span className="ml-0.5 text-base italic text-ink-soft">{unit}</span>
      </div>
    </div>
  );
}
