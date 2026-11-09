
function SummaryCard({ label, value, description, colorClass = "text-cyan-400" }) {
    return (
      <div className="min-w-0 rounded-lg border border-gray-800 bg-black/30 px-3 py-2">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`mt-1 text-lg font-bold tabular-nums ${colorClass}`}>
          {value}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    );
  }
  
  export default function SimulationSummary({ history = [] }) {
    const totalRuns = history.length;
  
    const averageQBER =
      totalRuns > 0
        ? history.reduce((sum, run) => sum + run.qber, 0) / totalRuns
        : null;
  
    const secureRuns = history.filter((run) => run.mode === "secure").length;
    const attackRuns = history.filter((run) => run.mode === "attack").length;
    const generatedKeys = history.filter((run) => run.keyGenerated === true).length;
    const rejectedKeys = history.filter((run) => run.keyGenerated === false).length;
  
    return (
      <section className="min-w-0 rounded-xl border border-cyan-500/20 bg-black/40 p-3">
        <div className="mb-2">
          <h2 className="text-sm font-bold text-cyan-400">
            SIMULATION SUMMARY
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Overview of results from this session.
          </p>
        </div>
  
        {totalRuns === 0 ? (
          <p className="py-3 text-center text-sm text-gray-500">
            Run a simulation to generate summary statistics.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            <SummaryCard
              label="Total Runs"
              value={totalRuns}
              description="Completed simulations"
            />
  
            <SummaryCard
              label="Average QBER"
              value={`${averageQBER.toFixed(2)}%`}
              description="Across all runs"
              colorClass={
                averageQBER > 11 ? "text-red-400" : "text-green-400"
              }
            />
  
            <SummaryCard
              label="Keys Generated"
              value={generatedKeys}
              description="Accepted candidate keys"
              colorClass="text-green-400"
            />
  
            <SummaryCard
              label="Keys Rejected"
              value={rejectedKeys}
              description="Rejected candidate keys"
              colorClass="text-red-400"
            />
  
            <SummaryCard
              label="Secure Runs"
              value={secureRuns}
              description="Secure mode selected"
              colorClass="text-green-400"
            />
  
            <SummaryCard
              label="Attack Runs"
              value={attackRuns}
              description="Attack mode selected"
              colorClass="text-red-400"
            />
          </div>
        )}
      </section>
    );
  }
  