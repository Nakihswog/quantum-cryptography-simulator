
export default function SharedKeyPanel({ simulationData }) {
  const sharedKey = simulationData?.shared_key ?? [];
  const qber = simulationData?.qber ?? 0;
  const threshold = simulationData?.qber_threshold ?? 11;

  const hasSimulation = simulationData != null;

  const keyGenerated =
    simulationData?.key_generated ?? sharedKey.length > 0;

  const status = simulationData?.key_generation_status;

  const message =
    simulationData?.key_generation_message ??
    "Run the simulation to check whether a candidate key can be generated.";

  const statusStyles = keyGenerated
    ? {
        container: "border-green-500/30 bg-green-500/5",
        label: "text-green-400",
        heading: "CANDIDATE KEY GENERATED",
      }
    : {
        container: "border-red-500/30 bg-red-500/5",
        label: "text-red-400",
        heading: "KEY NOT GENERATED",
      };

  return (
    <div className="bg-black/40 border border-green-500/20 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-green-400 font-bold">
          SHARED KEY
        </h2>

        {keyGenerated && (
          <span className="text-xs text-gray-400">
            {sharedKey.length} BITS
          </span>
        )}
      </div>

      {!hasSimulation ? (
        <p className="text-gray-500 text-sm">
          Run the simulation to check whether a candidate key can be generated.
        </p>
      ) : (
        <>
          <div
            className={`rounded-lg border p-2 mb-2 ${statusStyles.container}`}
            role="status"
            aria-live="polite"
          >
            <div className={`text-xs font-bold mb-1 ${statusStyles.label}`}>
              {statusStyles.heading}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>

          {keyGenerated ? (
            <div className="flex flex-wrap gap-2">
              {sharedKey.map((bit, index) => (
                <div
                  key={index}
                  className="
                    w-8 h-8 rounded-lg
                    bg-green-500/20 border border-green-400
                    flex items-center justify-center
                    text-green-300 font-bold
                  "
                  title={`Key bit ${index + 1}`}
                >
                  {bit}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No candidate key is available for this run.
            </p>
          )}

          <div className="mt-2 pt-2 border-t border-gray-800 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-gray-500">
                QBER
              </div>

              <div
                className={`text-sm font-bold ${
                  qber > threshold
                    ? "text-red-400"
                    : "text-cyan-300"
                }`}
              >
                {qber.toFixed(2)}%
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500">
                Threshold
              </div>

              <div className="text-sm font-bold text-gray-200">
                {threshold}%
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500">
                Matching bases
              </div>

              <div className="text-sm font-bold text-gray-200">
                {simulationData.total_checked ?? 0}
              </div>
            </div>
          </div>

          {keyGenerated && (
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
              A candidate key is not proof of security. A real QKD system
              also needs error correction, privacy amplification, and
              security verification.
            </p>
          )}

          {status === "failed_no_matching_bases" && (
            <p className="text-[10px] text-gray-500 mt-2">
              Run another simulation. The sender and receiver choose
              their bases randomly.
            </p>
          )}
        </>
      )}
    </div>
  );
}
