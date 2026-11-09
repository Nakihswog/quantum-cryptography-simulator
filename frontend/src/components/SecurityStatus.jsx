
const QBER_THRESHOLD = 11;

export default function SecurityStatus({ simulationData }) {
  const qber = Number(simulationData?.qber ?? 0);
  const status = simulationData?.security_status ?? "WAITING";

  const keyStatus =
    simulationData?.key_generation_status ?? "unknown";

  const keyGenerated =
    simulationData?.key_generated === true;

  const hasRun = simulationData != null;

  const isInconclusive =
    status.toUpperCase().includes("INCONCLUSIVE");

  const highQber = qber > QBER_THRESHOLD;

  const secure = status.toUpperCase() === "SECURE";

  const statusClass = !hasRun
    ? "bg-gray-500/10 text-gray-400 border-gray-500/30"
    : isInconclusive
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : highQber
        ? "bg-red-500/10 text-red-400 border-red-500/30"
        : secure
          ? "bg-green-500/10 text-green-400 border-green-500/30"
          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

  const headingClass = highQber
    ? "text-red-400"
    : secure
      ? "text-green-400"
      : "text-cyan-400";

  let explanation;

  if (!hasRun) {
    explanation = "Run a simulation to inspect its security results.";
  } else if (isInconclusive) {
    explanation =
      "There were no matching bases, so QBER could not be meaningfully evaluated.";
  } else if (highQber) {
    explanation =
      "The observed QBER exceeds the configured threshold. The simulator should reject the candidate key.";
  } else {
    explanation =
      "The observed QBER is at or below the configured threshold. This alone does not prove that the key is secure.";
  }

  let keyMessage;

  if (!hasRun) {
    keyMessage = "Waiting for simulation results.";
  } else if (keyGenerated) {
    keyMessage =
      "A candidate key was generated. This educational simulation does not prove that it is secure.";
  } else if (keyStatus === "failed_no_matching_bases") {
    keyMessage =
      "No candidate key was generated because no bases matched.";
  } else if (keyStatus === "failed_high_qber") {
    keyMessage =
      "The candidate key was rejected because QBER exceeded the configured threshold.";
  } else {
    keyMessage =
      "No candidate key was generated for this run.";
  }

  return (
    <div
      className={`bg-black/40 border rounded-xl p-4 ${
        highQber
          ? "border-red-500/30"
          : secure
            ? "border-green-500/30"
            : "border-cyan-500/20"
      }`}
    >
      <h2 className={`font-bold mb-4 ${headingClass}`}>
        SECURITY STATUS
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400">
            Quantum Bit Error Rate
          </p>

          <p
            className={`text-3xl font-bold ${
              highQber ? "text-red-400" : "text-cyan-400"
            }`}
          >
            {qber.toFixed(2)}%
          </p>

          <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                highQber ? "bg-red-400" : "bg-cyan-400"
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, qber))}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Observed QBER</span>
            <span>Threshold: {QBER_THRESHOLD}%</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Channel Status
          </p>

          <div
            className={`mt-2 rounded-lg border px-3 py-2 text-center font-bold ${statusClass}`}
          >
            {!hasRun ? "WAITING FOR SIMULATION" : status}
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {explanation}
          </p>
        </div>

        <div className="border-t border-gray-800 pt-3">
          <div className="flex justify-between items-center gap-3">
            <p className="text-sm text-gray-300">
              Candidate Key
            </p>

            <span
              className={`text-xs font-bold ${
                keyGenerated
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {!hasRun
                ? "PENDING"
                : keyGenerated
                  ? "GENERATED"
                  : "NOT GENERATED"}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {keyMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
