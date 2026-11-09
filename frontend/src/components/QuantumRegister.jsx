
import { useState } from "react";

export default function QuantumRegister({ simulationData }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const bits = simulationData?.ghost_bits ?? [];
  const bases = simulationData?.ghost_bases ?? [];
  const rolexBases = simulationData?.rolex_bases ?? [];
  const interceptedBits = simulationData?.intercepted_bits ?? [];
  const interceptionFlags = simulationData?.interception_flags ?? [];
  const noiseFlags = simulationData?.channel_noise_flags ?? [];
  const leoBases = simulationData?.leo_bases ?? [];
  const leoResults = simulationData?.leo_results ?? [];

  const hasData = bits.length > 0;
  const safeIndex = Math.min(
    selectedIndex,
    Math.max(0, bits.length - 1)
  );

  const selectedBit = bits[safeIndex];
  const selectedBasis = bases[safeIndex];
  const leoBit = leoResults[safeIndex];
  const leoBasis = leoBases[safeIndex];

  const intercepted = interceptionFlags[safeIndex] === true;
  const noisy = noiseFlags[safeIndex] === true;

  const basesMatch =
    selectedBasis != null &&
    leoBasis != null &&
    selectedBasis === leoBasis;

  const isError =
    basesMatch &&
    selectedBit != null &&
    leoBit != null &&
    selectedBit !== leoBit;

  const getState = (bit, basis) => {
    if (bit == null || basis == null) return "—";

    if (basis === "+") {
      return bit === 0 ? "|0⟩" : "|1⟩";
    }

    return bit === 0 ? "|+⟩" : "|−⟩";
  };

  // Explicit Tailwind classes ensure all status colors are generated.
  const statusStyles = {
    orange: "border-orange-400/60 bg-orange-500/10 text-orange-300",
    amber: "border-amber-400/60 bg-amber-500/10 text-amber-300",
    green: "border-green-400/60 bg-green-500/10 text-green-300",
    red: "border-red-400/60 bg-red-500/10 text-red-300",
  };

  const statusClass = (active, color) =>
    active
      ? statusStyles[color]
      : "border-gray-700 bg-slate-900/60 text-gray-500";

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-2 sm:p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-cyan-400 font-bold text-base sm:text-lg">
          GHOST QUANTUM REGISTER
        </h2>

        {hasData && (
          <span className="text-[10px] sm:text-xs text-gray-500">
            {bits.length} QUBITS
          </span>
        )}
      </div>

      {!hasData ? (
        <p className="text-gray-500 text-sm py-2">
          Run the simulation to generate qubits.
        </p>
      ) : (
        <>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5">
            Select a qubit to inspect its transmission details.
          </p>

          {/* Compact qubit grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {bits.map((bit, index) => {
              const wasIntercepted =
                interceptionFlags[index] === true;
              const hadNoise = noiseFlags[index] === true;

              const matched =
                bases[index] != null &&
                leoBases[index] != null &&
                bases[index] === leoBases[index];

              const error =
                matched &&
                leoResults[index] != null &&
                bit !== leoResults[index];

              let borderClass = "border-cyan-500/30";

              if (error) {
                borderClass = "border-red-500";
              } else if (wasIntercepted) {
                borderClass = "border-orange-400";
              } else if (hadNoise) {
                borderClass = "border-amber-400";
              }

              const selected = safeIndex === index;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-pressed={selected}
                  title={`Inspect qubit ${index + 1}`}
                  className={`min-w-0 rounded-lg border ${borderClass} ${
                    selected ? "ring-2 ring-cyan-400" : ""
                  } bg-slate-900/60 px-1.5 py-1.5 sm:px-2 sm:py-2
                    h-[66px] sm:h-[74px] flex flex-col justify-between
                    transition-colors hover:bg-slate-800`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-500">
                      Q{index + 1}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {bases[index] ?? "—"}
                    </span>
                  </div>

                  <div className="text-lg sm:text-xl leading-none text-cyan-300 font-bold text-center">
                    {bit}
                  </div>

                  <div className="text-[8px] sm:text-[9px] leading-tight text-center text-gray-400 truncate">
                    {wasIntercepted
                      ? "INTERCEPTED"
                      : hadNoise
                        ? "NOISE"
                        : matched
                          ? "MATCH"
                          : "—"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected qubit details */}
          <div className="mt-2 border border-cyan-500/20 rounded-lg p-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-cyan-300">
                QUBIT {safeIndex + 1} DETAILS
              </h3>

              <span className="text-[10px] sm:text-xs text-gray-400">
                {getState(selectedBit, selectedBasis)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <Detail label="Ghost bit" value={selectedBit ?? "—"} />
              <Detail label="Ghost basis" value={selectedBasis ?? "—"} />
              <Detail
                label="Rolex intercepted"
                value={intercepted ? "Yes" : "No"}
              />

              <Detail
                label="Rolex basis"
                value={rolexBases[safeIndex] ?? "—"}
              />
              <Detail
                label="Rolex measured bit"
                value={interceptedBits[safeIndex] ?? "—"}
              />
              <Detail
                label="Channel noise"
                value={noisy ? "Yes" : "No"}
              />

              <Detail label="Leo basis" value={leoBasis ?? "—"} />
              <Detail label="Leo result" value={leoBit ?? "—"} />
              <Detail
                label="Bases match"
                value={basesMatch ? "Yes" : "No"}
              />
            </div>

            {/* Compact status indicators */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <StatusTag
                active={intercepted}
                color="orange"
                activeText="Rolex interception"
                inactiveText="No interception"
              />

              <StatusTag
                active={noisy}
                color="amber"
                activeText="Noise event"
                inactiveText="No noise event"
              />

              <StatusTag
                active={basesMatch}
                color="green"
                activeText="Included in sifted positions"
                inactiveText="Discarded: basis mismatch"
              />

              <StatusTag
                active={isError}
                color="red"
                activeText="Bit error detected"
                inactiveText="No sifted bit error"
              />
            </div>

            <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">
              Educational model: bit errors are compared only when Ghost's
              and Leo's bases match. This is not a complete QKD security
              verification.
            </p>
          </div>

          {/* Color legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px] text-gray-400">
            <span>🔴 Sifted bit error</span>
            <span>🟠 Intercepted</span>
            <span>🟡 Noise event</span>
            <span>🔵 Selected qubit</span>
          </div>
        </>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0 bg-slate-900/60 border border-gray-800 rounded p-1.5">
      <div className="text-[9px] text-gray-500 mb-0.5 truncate">
        {label}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-gray-200 break-words">
        {String(value)}
      </div>
    </div>
  );
}

function StatusTag({
  active,
  color,
  activeText,
  inactiveText,
}) {
  const styles = {
    orange: "border-orange-400/60 bg-orange-500/10 text-orange-300",
    amber: "border-amber-400/60 bg-amber-500/10 text-amber-300",
    green: "border-green-400/60 bg-green-500/10 text-green-300",
    red: "border-red-400/60 bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`text-[9px] border rounded px-1.5 py-1 ${
        active
          ? styles[color]
          : "border-gray-700 bg-slate-900/60 text-gray-500"
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  );
}
