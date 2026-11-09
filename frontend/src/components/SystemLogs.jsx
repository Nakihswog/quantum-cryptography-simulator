export default function SystemLogs({ logs = [] }) {
  return (
    <div className="bg-black/40 border border-gray-500/30 rounded-xl p-4">
      <h2 className="text-gray-200 font-bold mb-4">
        SYSTEM LOGS
      </h2>

      <div className="bg-black rounded-lg p-3 h-72 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500">
            Waiting for simulation...
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="text-green-400 mb-2"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}