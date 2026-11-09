
function StatCard({ label, value, description, colorClass }) {
    return (
      <div className="min-w-0 rounded-lg border border-gray-800 bg-black/30 px-3 py-2">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`mt-1 text-lg font-bold tabular-nums ${colorClass}`}>
          {value}
        </p>
        <p className="mt-0.5 text-xs leading-4 text-gray-500">
          {description}
        </p>
      </div>
    );
  }
  
  export default function AttackDetectionStats({ history = [] }) {
    const threshold = 11;
  
    const attackRuns = history.filter((run) => run.mode === "attack");
  
    const eligibleAttackRuns = attackRuns.filter(
      (run) => (run.totalChecked ?? 0) > 0
    );
  
    const detectedRuns = eligibleAttackRuns.filter(
      (run) => run.qber > threshold
    );
  
    const rejectedAttackKeys = attackRuns.filter(
      (run) => run.keyGenerated === false
    ).length;
  
    const detectionRate =
      eligibleAttackRuns.length > 0
        ? (detectedRuns.length / eligibleAttackRuns.length) * 100
        : null;
  
    return (
      <section className="min-w-0 rounded-xl border border-orange-500/20 bg-black/40 p-3">
        <div className="mb-2">
          <h2 className="text-sm font-bold text-orange-400">
            ATTACK DETECTION STATISTICS
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Suspicious QBER results in Attack Mode.
          </p>
        </div>
  
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            label="Attack Runs"
            value={attackRuns.length}
            description="Runs using Attack Mode"
            colorClass="text-orange-400"
          />
  
          <StatCard
            label="Eligible Runs"
            value={eligibleAttackRuns.length}
            description="With matching-basis measurements"
            colorClass="text-cyan-400"
          />
  
          <StatCard
            label="High-QBER Runs"
            value={detectedRuns.length}
            description={`Eligible runs above ${threshold}% QBER`}
            colorClass="text-red-400"
          />
  
          <StatCard
            label="Rejected Keys"
            value={rejectedAttackKeys}
            description="Attack runs where key generation failed"
            colorClass="text-red-400"
          />
        </div>
  
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-800 bg-black/20 px-3 py-2">
          <div>
            <p className="text-sm text-gray-300">
              High-QBER rate among eligible attack runs
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              High QBER is a warning indicator, not definitive proof of an attack.
            </p>
          </div>
  
          <span className="text-lg font-bold tabular-nums text-orange-400">
            {detectionRate === null ? "--" : `${detectionRate.toFixed(1)}%`}
          </span>
        </div>
      </section>
    );
  }
  