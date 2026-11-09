import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportReport({ history = [] }) {
  async function downloadReport() {
    if (!history.length) {
      alert("Run at least one simulation before exporting a report.");
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      const generatedAt = new Date().toLocaleString();

      const totalRuns = history.length;

      const secureRuns = history.filter(
        (run) => run.mode === "secure"
      ).length;

      const attackRuns = history.filter(
        (run) => run.mode === "attack"
      ).length;

      const keysGenerated = history.filter(
        (run) => run.keyGenerated === true
      ).length;

      const rejectedKeys = totalRuns - keysGenerated;

      const qberValues = history.map(
        (run) => Number(run.qber) || 0
      );

      const averageQber =
        qberValues.reduce((sum, value) => sum + value, 0) /
        totalRuns;

      const highestQber = Math.max(...qberValues);

      const percent = (value) =>
        `${Number(value || 0).toFixed(2)}%`;

      function sectionTitle(title, y) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(8, 145, 178);
        pdf.text(title, margin, y);
        return y + 5;
      }

      function addFooters() {
        const pageCount = pdf.internal.getNumberOfPages();

        for (let page = 1; page <= pageCount; page += 1) {
          pdf.setPage(page);

          const currentWidth = pdf.internal.pageSize.getWidth();
          const currentHeight = pdf.internal.pageSize.getHeight();

          pdf.setDrawColor(210, 220, 230);
          pdf.line(
            margin,
            currentHeight - 13,
            currentWidth - margin,
            currentHeight - 13
          );

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(100, 116, 139);

          pdf.text(
            "BB84 Quantum Cryptography Simulator | Educational Report",
            margin,
            currentHeight - 8
          );

          pdf.text(
            `Page ${page} of ${pageCount}`,
            currentWidth - margin,
            currentHeight - 8,
            { align: "right" }
          );
        }
      }

      // 1. Report header
      pdf.setFillColor(8, 25, 48);
      pdf.rect(0, 0, pageWidth, 43, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.setTextColor(103, 232, 249);
      pdf.text("BB84 SIMULATION REPORT", margin, 17);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(235, 245, 255);
      pdf.text("Quantum Cryptography Security Analysis", margin, 25);
      pdf.text(`Generated: ${generatedAt}`, margin, 33);

      pdf.setFontSize(8);
      pdf.setTextColor(190, 210, 230);
      pdf.text(
        "Educational simulation using simplified BB84 protocol logic",
        margin,
        38
      );

      let y = 53;

      // 2. Executive summary
      y = sectionTitle("1. EXECUTIVE SUMMARY", y);

      autoTable(pdf, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["Metric", "Result", "Metric", "Result"]],
        body: [
          [
            "Total simulations",
            String(totalRuns),
            "Candidate keys generated",
            String(keysGenerated),
          ],
          [
            "Secure-mode runs",
            String(secureRuns),
            "Attack-mode runs",
            String(attackRuns),
          ],
          [
            "Keys not generated",
            String(rejectedKeys),
            "Average QBER",
            percent(averageQber),
          ],
          [
            "Highest QBER",
            percent(highestQber),
            "Configured threshold",
            "11%",
          ],
        ],
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
          textColor: [35, 45, 60],
        },
        headStyles: {
          fillColor: [15, 45, 75],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [242, 248, 252],
        },
        columnStyles: {
          0: { cellWidth: 43 },
          1: { cellWidth: 35 },
          2: { cellWidth: 43 },
          3: { cellWidth: "auto" },
        },
      });

      y = pdf.lastAutoTable.finalY + 9;

      // 3. Security analysis
      if (y > pageHeight - 55) {
        pdf.addPage("a4", "portrait");
        y = 20;
      }

      y = sectionTitle("2. SECURITY ANALYSIS", y);

      const analysis = [
        `Average QBER across recorded runs: ${percent(averageQber)}.`,
        `Highest QBER observed: ${percent(highestQber)}.`,
        `Candidate keys were generated in ${keysGenerated} of ${totalRuns} runs.`,
        "QBER measures the proportion of errors among the bits compared for error estimation.",
        "A high QBER can indicate eavesdropping or channel noise. QBER alone cannot identify the cause.",
      ];

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(45, 55, 72);

      analysis.forEach((item) => {
        const lines = pdf.splitTextToSize(
          `- ${item}`,
          contentWidth - 4
        );

        if (y + lines.length * 5 > pageHeight - 20) {
          pdf.addPage("a4", "portrait");
          y = 20;
        }

        pdf.text(lines, margin + 2, y);
        y += lines.length * 5 + 2;
      });

      // 4. Detailed results on a landscape page
      pdf.addPage("a4", "landscape");

      const landscapeMargin = 10;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(8, 145, 178);
      pdf.text(
        "3. DETAILED SIMULATION RESULTS",
        landscapeMargin,
        18
      );

      autoTable(pdf, {
        startY: 25,
        margin: {
          left: landscapeMargin,
          right: landscapeMargin,
          bottom: 18,
        },
        head: [[
          "Run",
          "Mode",
          "Attack %",
          "Noise %",
          "QBER %",
          "Intercepted",
          "Noise events",
          "Bases checked",
          "Errors",
          "Key status",
        ]],
        body: history.map((run) => [
          run.run ?? "-",
          run.mode ?? "-",
          Number(run.attackIntensity || 0).toFixed(0),
          Number(run.channelNoise || 0).toFixed(0),
          Number(run.qber || 0).toFixed(2),
          run.interceptedCount ?? 0,
          run.noiseCount ?? 0,
          run.totalChecked ?? 0,
          run.errors ?? 0,
          run.keyGenerated ? "Generated" : "Rejected",
        ]),
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 7,
          cellPadding: 2.5,
          overflow: "linebreak",
          textColor: [35, 45, 60],
        },
        headStyles: {
          fillColor: [15, 45, 75],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [242, 248, 252],
        },
        horizontalPageBreak: true,
        horizontalPageBreakRepeat: [0, 1],
      });

      // 5. Conclusion and limitations
      pdf.addPage("a4", "portrait");
      y = 22;

      y = sectionTitle("4. CONCLUSION AND LIMITATIONS", y);

      const conclusion = [
        `This report summarizes ${totalRuns} recorded BB84 simulation run(s).`,
        `Candidate keys were generated in ${keysGenerated} run(s) and were not generated in ${rejectedKeys} run(s).`,
        "The configured QBER threshold in this project is 11%. Interpret results using the simulator's security-status and key-generation logic.",
        "This is an educational software simulation. It does not use physical qubits or provide real-world quantum key distribution.",
        "The simulation uses simplified protocol logic and a limited sample size. Results are illustrative, not a formal security proof.",
      ];

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(45, 55, 72);

      conclusion.forEach((item) => {
        const lines = pdf.splitTextToSize(item, contentWidth);

        if (y + lines.length * 5 + 5 > pageHeight - 20) {
          pdf.addPage("a4", "portrait");
          y = 20;
        }

        pdf.text(lines, margin, y);
        y += lines.length * 5 + 5;
      });

      // Add page numbers and footer text
      addFooters();

      // 6. Generate and validate the PDF
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

      const fileName = `BB84-Simulation-Report-${timestamp}.pdf`;
      const pdfBlob = pdf.output("blob");

      if (
        !(pdfBlob instanceof Blob) ||
        pdfBlob.size === 0 ||
        pdfBlob.type !== "application/pdf"
      ) {
        throw new Error(
          `Invalid PDF generated. Size: ${pdfBlob.size}, Type: ${pdfBlob.type}`
        );
      }

      // Confirm that the file begins with the PDF signature.
      const signature = new Uint8Array(
        await pdfBlob.slice(0, 5).arrayBuffer()
      );

      const signatureText = String.fromCharCode(...signature);

      if (signatureText !== "%PDF-") {
        throw new Error(
          "Generated file does not have a valid PDF signature."
        );
      }

      console.log("PDF generated successfully:", {
        fileName,
        sizeBytes: pdfBlob.size,
        type: pdfBlob.type,
      });

      // Use jsPDF's native download method.
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF report generation failed:", error);

      alert(
        `The PDF report could not be generated or downloaded.\n\n${error.message || error}\n\nOpen the browser console (F12) for more details.`
      );
    }
  }

  return (
    <section className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-500/20 bg-black/40 p-3 sm:p-4">
      <div className="min-w-0">
        <h2 className="font-bold text-cyan-400">
          SIMULATION REPORT
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Download a structured PDF with summary statistics,
          security analysis, and detailed simulation results.
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {history.length} simulation
          {history.length === 1 ? "" : "s"} recorded
        </p>
      </div>

      <button
        type="button"
        onClick={downloadReport}
        disabled={history.length === 0}
        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-400 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        DOWNLOAD PDF
      </button>
    </section>
  );
}