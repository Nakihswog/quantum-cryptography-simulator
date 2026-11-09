export default function SimulationMode({ mode, setMode }) {
    return (
      <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4">
        <h2 className="text-purple-400 font-bold mb-3">
          SIMULATION MODE
        </h2>
  
        <div className="flex justify-center items-center gap-4">
  
          {/* SECURE MODE */}
          <button
            onClick={() => setMode("secure")}
            className={`
              w-48
              h-12
              rounded-lg
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition-all
              duration-300
              border
              ${
                mode === "secure"
                  ? "bg-green-500/20 text-green-400 border-green-400 shadow-lg shadow-green-500/20"
                  : "bg-slate-900/60 text-gray-400 border-gray-700 hover:border-green-400 hover:text-green-400"
              }
            `}
          >
            <span className="text-lg">🟢</span>
            SECURE
          </button>
  
          {/* ATTACK MODE */}
          <button
            onClick={() => setMode("attack")}
            className={`
              w-48
              h-12
              rounded-lg
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition-all
              duration-300
              border
              ${
                mode === "attack"
                  ? "bg-red-500/20 text-red-400 border-red-400 shadow-lg shadow-red-500/20"
                  : "bg-slate-900/60 text-gray-400 border-gray-700 hover:border-red-400 hover:text-red-400"
              }
            `}
          >
            <span className="text-lg">🔴</span>
            ATTACK
          </button>
  
        </div>
  
        {/* MODE DESCRIPTION */}
        <p className="text-xs text-gray-500 text-center mt-3">
          {mode === "secure"
            ? "Ghost communicates directly with Leo."
            : "Rolex intercepts the quantum transmission."
          }
        </p>
      </div>
    );
  }