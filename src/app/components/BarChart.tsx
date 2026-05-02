"use client";

import { Bar } from "react-chartjs-2";
import { Course } from "./SideBar";
import {
   Chart as ChartJS,
   ChartOptions,
   CategoryScale,
   LinearScale,
   BarElement,
   Title as ChartTitle,
   Tooltip,
   Legend,
   ChartData,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   ChartTitle,
   Tooltip,
   Legend,
   ChartDataLabels
);

interface BarChartProps {
   grades: Course[];
   colors: string[];
}

const gradeColors: { [key: string]: string } = {
   A: "#4ade80",
   B: "#60a5fa",
   C: "#facc15",
   D: "#fb923c",
   P: "#34d399",
   I: "#a78bfa",
   F: "#f87171",
   Q: "#94a3b8",
   W: "#94a3b8",
   Z: "#94a3b8",
   R: "#94a3b8",
};

const BarChart: React.FC<BarChartProps> = ({ grades, colors }) => {
   if (!grades || grades.length === 0 || !colors || colors.length === 0) {
      return null;
   }

   const gradeLabels = ["A", "B", "C", "D", "P", "I", "F", "Q", "W", "Z", "R"];
   const multiProfessor = grades.length > 1;

   const datasets = grades.map((course, index) => {
      const multiColor = colors[index % colors.length] || "#57D2DD";

      if (!course) {
         return {
            label: `Professor ${index + 1}`,
            data: new Array(gradeLabels.length).fill(0),
            backgroundColor: multiProfessor
               ? multiColor
               : gradeLabels.map((g) => gradeColors[g] ?? "#94a3b8"),
            borderRadius: 7,
            borderSkipped: "bottom" as const,
         };
      }

      const gradeValues = [
         ((course.grades_A ?? 0) / course.grades_count) * 100,
         ((course.grades_B ?? 0) / course.grades_count) * 100,
         ((course.grades_C ?? 0) / course.grades_count) * 100,
         ((course.grades_D ?? 0) / course.grades_count) * 100,
         ((course.grades_P ?? 0) / course.grades_count) * 100,
         ((course.grades_I ?? 0) / course.grades_count) * 100,
         ((course.grades_F ?? 0) / course.grades_count) * 100,
         ((course.grades_Q ?? 0) / course.grades_count) * 100,
         ((course.grades_W ?? 0) / course.grades_count) * 100,
         ((course.grades_Z ?? 0) / course.grades_count) * 100,
         ((course.grades_R ?? 0) / course.grades_count) * 100,
      ];

      return {
         label: `${course.instructor1}`,
         data: gradeValues,
         backgroundColor: multiProfessor
            ? multiColor
            : gradeLabels.map((g) => gradeColors[g] ?? "#94a3b8"),
         borderRadius: 7,
         borderSkipped: "bottom" as const,
      };
   });

   const nonZeroIndices = gradeLabels.reduce(
      (indices: number[], _label, index) => {
         const hasNonZeroData = datasets.some((dataset) => dataset.data[index] > 0);
         if (hasNonZeroData) indices.push(index);
         return indices;
      },
      []
   );

   const filteredLabels = nonZeroIndices.map((index) => gradeLabels[index]);
   const filteredDatasets = datasets.map((dataset, i) => ({
      ...dataset,
      data: nonZeroIndices.map((index) => dataset.data[index]),
      backgroundColor: multiProfessor
         ? (colors[i % colors.length] || "#57D2DD")
         : filteredLabels.map((g) => gradeColors[g] ?? "#94a3b8"),
   }));

   const data: ChartData<"bar", number[], string> = {
      labels: filteredLabels,
      datasets: filteredDatasets,
   };

   const options: ChartOptions<"bar"> = {
      responsive: true,
      scales: {
         x: {
            ticks: { color: "white", font: { size: 13 } },
            grid: { color: "rgba(255, 255, 255, 0.06)" },
         },
         y: {
            ticks: {
               color: "white",
               font: { size: 13 },
               callback: (value) => value + "%",
            },
            grid: { color: "rgba(255, 255, 255, 0.06)" },
         },
      },
      plugins: {
         legend: {
            display: multiProfessor,
            labels: { color: "white", font: { size: 13 } },
         },
         datalabels: {
            display: !multiProfessor,
            anchor: "end",
            align: "end",
            offset: 2,
            color: "rgba(255,255,255,0.55)",
            font: { size: 11, weight: "bold" },
            formatter: (value: number) => value > 0 ? `${Math.round(value)}%` : "",
         },
         tooltip: {
            titleColor: "white",
            bodyColor: "white",
            backgroundColor: "rgba(0,0,0,0.8)",
            callbacks: {
               title: () => "",
               label: () => "",
               footer: (tooltipItems) => {
                  const datasetIndex = tooltipItems[0].datasetIndex;
                  const course = grades[datasetIndex] as Course;
                  if (!course) return;
                  const gradeLabel = tooltipItems[0].label;
                  const gradeCount = course[`grades_${gradeLabel}` as keyof Course] || 0;
                  const pct = ((Number(gradeCount) / course.grades_count) * 100).toFixed(1);
                  return [`${gradeCount} students`, `${pct}%`];
               },
            },
         },
      },
   };

   return (
      <div className="mt-2 rounded-xl p-5 border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#0d0d0f]">
         <h2 className="text-sm font-semibold text-center text-gray-900 dark:text-white mb-4 tracking-widest uppercase">
            Grades Distribution
         </h2>
         <Bar data={data} options={options} />
      </div>
   );
};

export default BarChart;
