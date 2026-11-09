
import { useState } from "react";

import Header from "./components/Header";
import SecurityStatus from "./components/SecurityStatus";
import QBERGraph from "./components/QBERGraph";
import ProtocolFlow from "./components/ProtocolFlow";
import QuantumRegister from "./components/QuantumRegister";
import SharedKeyPanel from "./components/SharedKeyPanel";
import SystemLogs from "./components/SystemLogs";
import ModeComparison from "./components/ModeComparison";
import SimulationSummary from "./components/SimulationSummary";
import AttackDetectionStats from "./components/AttackDetectionStats";
import ExportReport from "./components/ExportReport";

export default function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [logs, setLogs] = useState([
    "[SYSTEM] Quantum channel initialized...",
  ]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [simulationMode, setSimulationMode] = useState("secure");
  const [attackIntensity, setAttackIntensity] = useState(50);
  const [channelNoise, setChannelNoise] = useState(0);

  async function runSimulation() {
    if (loading) return;

    const mode = simulationMode;
    const intensity = mode === "attack" ? attackIntensity : 0;
    const noise = channelNoise;

    setLoading(true);

    setLogs([
      `[INFO] ${mode.toUpperCase()} mode selected...`,
      "[INFO] Preparing qubits...",
      "[INFO] Encoding states...",
      mode === "attack"
        ? `[INFO] Rolex interception probability: ${intensity}%`
        : "[INFO] Secure mode selected; no intentional interception.",
      `[INFO] Channel noise probability: ${noise}%`,
      "[INFO] Transmitting qubits...",
      "[INFO] Leo measuring qubits...",
    ]);

    try {
      const url =
        "http://127.0.0.1:5000/simulate" +
        `?mode=${encodeURIComponent(mode)}` +
        `&intensity=${encodeURIComponent(intensity)}` +
        `&noise=${encodeURIComponent(noise)}`;

      const response = await fetch(url);

      if (!response.ok) {
        let message = `Backend request failed with HTTP ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData.error) {
            message = errorData.error;
          }
        } catch {
          // Keep the original HTTP error message.
        }

        throw new Error(message);
      }

      const data = await response.json();

      if (typeof data.qber !== "number") {
        throw new Error("The backend returned an invalid QBER value.");
      }

      setSimulationData(data);

      const totalQubits = data.ghost_bits?.length ?? 0;

      const interceptionRate =
        totalQubits > 0
          ? ((data.intercepted_count ?? 0) / totalQubits) * 100
          : 0;

      const noiseRate =
        totalQubits > 0
          ? ((data.channel_noise_count ?? 0) / totalQubits) * 100
          : 0;

      setHistory((previousHistory) => [
        ...previousHistory,
        {
          run: previousHistory.length + 1,
          qber: data.qber,
          mode,
          attackIntensity: intensity,
          channelNoise: noise,
          interceptionRate,
          noiseRate,
          interceptedCount: data.intercepted_count ?? 0,
          noiseCount: data.channel_noise_count ?? 0,
          totalChecked: data.total_checked ?? 0,
          errors: data.errors ?? 0,
          keyGenerated: data.key_generated === true,
        },
      ]);

      setLogs((previousLogs) => [
        ...previousLogs,
        `[INFO] Intercepted qubits: ${data.intercepted_count ?? 0}/${totalQubits}`,
        `[INFO] Channel noise events: ${data.channel_noise_count ?? 0}/${totalQubits}`,
        `[INFO] Matching bases checked: ${data.total_checked ?? 0}`,
        `[INFO] Errors detected: ${data.errors ?? 0}`,
        `[INFO] QBER = ${data.qber}%`,
        `[INFO] Status = ${data.security_status ?? "UNKNOWN"}`,
        "[SUCCESS] Simulation completed.",
      ]);
    } catch (error) {
      console.error("BB84 simulation failed:", error);

      setLogs((previousLogs) => [
        ...previousLogs,
        `[ERROR] ${error.message || "Simulation failed."}`,
        "[ERROR] Check that Flask is running at http://127.0.0.1:5000.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#000510] text-white">
      <Header
        loading={loading}
        runSimulation={runSimulation}
        simulationMode={simulationMode}
        setSimulationMode={setSimulationMode}
        attackIntensity={attackIntensity}
        setAttackIntensity={setAttackIntensity}
        channelNoise={channelNoise}
        setChannelNoise={setChannelNoise}
      />

      <section className="w-full space-y-1.5 px-2 py-1.5">
        {/* Session summary */}
        <SimulationSummary history={history} />

        {/* Attack detection statistics */}
        <AttackDetectionStats history={history} />

        {/* Export simulation report */}
        <ExportReport history={history} />

        {/* Main dashboard */}
        <div className="grid grid-cols-12 items-start gap-2">
          {/* Left column */}
          <div className="col-span-12 min-w-0 space-y-2 md:col-span-4 xl:col-span-3">
            <SecurityStatus simulationData={simulationData} />
            <QBERGraph history={history} />
          </div>

          {/* Center column */}
          <div className="col-span-12 min-w-0 space-y-2 md:col-span-8 xl:col-span-6">
            <ProtocolFlow />
            <QuantumRegister simulationData={simulationData} />
            <SharedKeyPanel simulationData={simulationData} />
          </div>

          {/* Right column */}
          <div className="col-span-12 min-w-0 space-y-2 xl:col-span-3">
            <SystemLogs logs={logs} />
            <ModeComparison history={history} />
          </div>
        </div>
      </section>
    </main>
  );
}
