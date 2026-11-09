export default function ProtocolFlow() {
  return (
    <div className="h-full min-h-0 bg-black/40 border border-cyan-500/20 rounded-xl p-4 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-cyan-400 font-bold">
          PROTOCOL FLOW
        </h2>

        <span className="text-xs text-gray-500">
          BB84 CHANNEL
        </span>
      </div>

      {/* Flow */}
      <div className="flex items-center justify-between h-[calc(100%-3rem)]">

        {/* Ghost */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">

          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-lg">
            G
          </div>

          <p className="mt-2 text-cyan-400 font-semibold">
            Ghost
          </p>

          <p className="text-[10px] text-gray-500">
            SENDER
          </p>

        </div>

        {/* Ghost → Rolex */}
        <div className="flex-1 mx-3">

          <div className="h-1 bg-cyan-500/50 rounded-full relative">
            <div className="absolute right-0 -top-1 border-l-8 border-l-cyan-400 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>

          <p className="text-[10px] text-cyan-400 text-center mt-2">
            QUBITS
          </p>

        </div>

        {/* Rolex */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">

          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-yellow-300 font-bold text-lg">
            R
          </div>

          <p className="mt-2 text-yellow-400 font-semibold">
            Rolex
          </p>

          <p className="text-[10px] text-gray-500">
            EAVESDROPPER
          </p>

        </div>

        {/* Rolex → Leo */}
        <div className="flex-1 mx-3">

          <div className="h-1 bg-cyan-500/50 rounded-full relative">
            <div className="absolute right-0 -top-1 border-l-8 border-l-cyan-400 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>

          <p className="text-[10px] text-cyan-400 text-center mt-2">
            MEASUREMENT
          </p>

        </div>

        {/* Leo */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">

          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center text-green-300 font-bold text-lg">
            L
          </div>

          <p className="mt-2 text-green-400 font-semibold">
            Leo
          </p>

          <p className="text-[10px] text-gray-500">
            RECEIVER
          </p>

        </div>

      </div>
    </div>
  );
}