
export default function Header({
  loading,
  runSimulation,
  simulationMode,
  setSimulationMode,
  attackIntensity,
  setAttackIntensity,
  channelNoise,
  setChannelNoise,
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-cyan-500/20 bg-black/40 px-4 py-2.5 xl:flex-nowrap">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-cyan-400 sm:text-2xl">
          BB84 QUANTUM KEY DISTRIBUTION
        </h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Quantum Cryptography Security Dashboard
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setSimulationMode("secure")}
          disabled={loading}
          className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors disabled:opacity-50 ${
            simulationMode === "secure"
              ? "border-green-400 bg-green-500/20 text-green-400"
              : "border-gray-700 bg-slate-900/60 text-gray-400 hover:border-green-400 hover:text-green-400"
          }`}
        >
          🟢 SECURE
        </button>

        <button
          type="button"
          onClick={() => setSimulationMode("attack")}
          disabled={loading}
          className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors disabled:opacity-50 ${
            simulationMode === "attack"
              ? "border-red-400 bg-red-500/20 text-red-400"
              : "border-gray-700 bg-slate-900/60 text-gray-400 hover:border-red-400 hover:text-red-400"
          }`}
        >
          🔴 ATTACK
        </button>

        <div className="w-32 px-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label
              htmlFor="attack-intensity"
              className="text-xs text-gray-300"
            >
              Attack intensity
            </label>
            <span className="text-xs font-bold text-red-400">
              {attackIntensity}%
            </span>
          </div>

          <input
            id="attack-intensity"
            type="range"
            min="0"
            max="100"
            step="10"
            value={attackIntensity}
            onChange={(event) =>
              setAttackIntensity(Number(event.target.value))
            }
            disabled={loading || simulationMode === "secure"}
            className="w-full accent-red-500 disabled:opacity-40"
          />

          <div className="flex justify-between text-[10px] text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="w-32 px-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label htmlFor="channel-noise" className="text-xs text-gray-300">
              Channel noise
            </label>
            <span className="text-xs font-bold text-amber-400">
              {channelNoise}%
            </span>
          </div>

          <input
            id="channel-noise"
            type="range"
            min="0"
            max="100"
            step="10"
            value={channelNoise}
            onChange={(event) =>
              setChannelNoise(Number(event.target.value))
            }
            disabled={loading}
            className="w-full accent-amber-400 disabled:opacity-40"
          />

          <div className="flex justify-between text-[10px] text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={runSimulation}
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300"
        >
          {loading ? "RUNNING..." : "START"}
        </button>
      </div>
    </header>
  );
}
