
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const QBER_THRESHOLD = 11;

export default function QBERGraph({ history = [] }) {
  const latestRun = history.length > 0
    ? history[history.length - 1]
    : null;

  const latestQBER = latestRun
    ? Number(latestRun.qber) || 0
    : null;

  const isAboveThreshold =
    latestQBER !== null && latestQBER > QBER_THRESHOLD;

  const chartData = history.map((item, index) => ({
    ...item,
    run: item.run ?? index + 1,
    qber: Number(item.qber) || 0,
  }));

  return (
    <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <h2 className="text-blue-400 font-bold">
            QBER HISTORY
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quantum Bit Error Rate across simulation runs
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">Latest QBER</p>
          <p
            className={`text-lg font-bold ${
              isAboveThreshold
                ? "text-red-400"
                : latestQBER === null
                  ? "text-gray-500"
                  : "text-cyan-400"
            }`}
          >
            {latestQBER === null
              ? "--"
              : `${latestQBER.toFixed(2)}%`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
          <span className="text-gray-400">Observed QBER</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-red-400 inline-block" />
          <span className="text-gray-400">
            Reference threshold ({QBER_THRESHOLD}%)
          </span>
        </div>
      </div>

      <div className="h-64">
        {chartData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            Run the simulation to build QBER history
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 12,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#374151"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="run"
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#4B5563" }}
                axisLine={{ stroke: "#4B5563" }}
                label={{
                  value: "Simulation Run",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#9CA3AF",
                  fontSize: 11,
                }}
              />

              <YAxis
                stroke="#9CA3AF"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                tickLine={{ stroke: "#4B5563" }}
                axisLine={{ stroke: "#4B5563" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#080D18",
                  border: "1px solid #164E63",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "#67E8F9",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `${Number(value).toFixed(2)}%`,
                  "QBER",
                ]}
                labelFormatter={(label) => `Run ${label}`}
              />

              <ReferenceLine
                y={QBER_THRESHOLD}
                stroke="#F87171"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: "11% threshold",
                  position: "insideTopRight",
                  fill: "#F87171",
                  fontSize: 11,
                }}
              />

              <Line
                type="monotone"
                dataKey="qber"
                name="QBER"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#06B6D4",
                  stroke: "#083344",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#67E8F9",
                  stroke: "#FFFFFF",
                  strokeWidth: 1,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {latestQBER !== null && (
        <div
          className={`mt-3 rounded-lg border p-3 ${
            isAboveThreshold
              ? "border-red-500/30 bg-red-500/5"
              : "border-cyan-500/20 bg-cyan-500/5"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isAboveThreshold ? "text-red-400" : "text-cyan-400"
            }`}
          >
            {isAboveThreshold
              ? "QBER exceeds the reference threshold"
              : "QBER is at or below the reference threshold"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {isAboveThreshold
              ? "The latest observed error rate is above 11%. Check the simulation's key-generation result."
              : "The latest observed error rate is within the configured threshold. This alone does not prove that a key is secure."}
          </p>
        </div>
      )}
    </div>
  );
}
