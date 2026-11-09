
function average(values) {
    if (values.length === 0) return null;
  
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  
  function Metric({ label, value }) {
    return (
      <div className="min-w-0 rounded-lg border border-gray-800 bg-black/30 p-2 sm:p-3">
        <p className="text-xs leading-4 text-gray-400 break-words">
          {label}
        </p>
  
        <p className="mt-1 text-base sm:text-lg font-bold text-cyan-400 tabular-nums">
          {value === null ? "--" : `${value.toFixed(2)}%`}
        </p>
      </div>
    );
  }
  
  function ModeCard({ title, colorClass, borderClass, runs, totalRuns }) {
    const qber = average(runs.map((run) => run.qber));
    const interception = average(runs.map((run) => run.interceptionRate));
    const noise = average(runs.map((run) => run.noiseRate));
  
    return (
      <div className={`min-w-0 rounded-xl border ${borderClass} bg-black/30 p-3`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className={`font-bold ${colorClass}`}>{title}</h3>
  
          <span className="text-xs text-gray-500">
            {runs.length} run{runs.length === 1 ? "" : "s"}
          </span>
        </div>
  
        {runs.length === 0 ? (
          <p className="py-2 text-sm text-gray-500">
            No {title.toLowerCase()} runs recorded yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Avg. QBER" value={qber} />
            <Metric label="Avg. Int." value={interception} />
            <Metric label="Avg. Noise" value={noise} />
          </div>
        )}
  
        <p className="mt-2 text-xs text-gray-500">
          {runs.length} of {totalRuns} total runs
        </p>
      </div>
    );
  }
  
  export default function ModeComparison({ history = [] }) {
    const secureRuns = history.filter((run) => run.mode === "secure");
    const attackRuns = history.filter((run) => run.mode === "attack");
  
    return (
      <section className="min-w-0 rounded-xl border border-blue-500/20 bg-black/40 p-3 sm:p-4">
        <div className="mb-3">
          <h2 className="font-bold text-blue-400">
            SECURE VS ATTACK COMPARISON
          </h2>
  
          <p className="mt-1 text-xs text-gray-500">
            Compare observed results across simulation runs.
          </p>
        </div>
  
        {history.length === 0 ? (
          <div className="py-5 text-center text-sm text-gray-500">
            Run simulations in Secure Mode and Attack Mode to compare results.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <ModeCard
              title="SECURE MODE"
              colorClass="text-green-400"
              borderClass="border-green-500/30"
              runs={secureRuns}
              totalRuns={history.length}
            />
  
            <ModeCard
              title="ATTACK MODE"
              colorClass="text-red-400"
              borderClass="border-red-500/30"
              runs={attackRuns}
              totalRuns={history.length}
            />
          </div>
        )}
  
        <p className="mt-3 text-xs leading-5 text-gray-500">
          These are observed simulation averages, not proof of cryptographic
          security. Results depend on random bases, attack intensity, and channel
          noise.
        </p>
      </section>
    );
  }
  