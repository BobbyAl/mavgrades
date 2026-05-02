import { useState, useEffect, useRef } from "react";
import BarChart from "./BarChart";
import { GradesInfoCard } from "./GradesInfoCard";
import Image from "next/image";
import { Info } from "lucide-react";

const chartColors = ["#60A5FA", "#34D399", "#FBBF24", "#2DD4BF", "#FB7185", "#FDE047"];

const StatsCard = ({
  selectedItems,
}: {
  selectedItems: Map<string, any>;
}) => {
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [openAverageInfoIndex, setOpenAverageInfoIndex] = useState<number | null>(null);
  const infoBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const averageInfoRef = useRef<HTMLDivElement | null>(null);
  const averageInfoButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const aggregatedData = Array.from(selectedItems.values());


  const getRMPUrl = (professorName: string) => {
    return `https://www.ratemyprofessors.com/search/professors/1343?q=${encodeURIComponent(professorName)}`;
  };

  const formatGpaValue = (courseGpa: number) => {
    const safeGpa = Number.isFinite(courseGpa) ? Math.min(Math.max(courseGpa, 0), 4) : 0;
    return `${safeGpa.toFixed(2)}/4.00`;
  };

  const averageGradeExplanation =
    "Course GPA is calculated from the grade distribution using UTA grade points: A=4, B=3, C=2, D=1, F=0. Grades like P, W, Q, I, R, and Z are excluded from GPA per UTA policy. This card shows the GPA directly on a 4.00 scale.";

  const StatCell = ({
    label,
    value,
    isProf = false,
    infoIndex,
    onInfoToggle,
    showInfo,
  }: {
    label: string;
    value: string | number;
    isProf?: boolean;
    infoIndex?: number;
    onInfoToggle?: (index: number) => void;
    showInfo?: boolean;
  }) => {
    const hasInfo = typeof infoIndex === "number" && typeof onInfoToggle === "function";

    return (
      <div className="relative flex flex-col gap-1.5 p-3 rounded-lg bg-gray-100 dark:bg-[#111113] border border-black/[0.06] dark:border-white/[0.06] overflow-hidden min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-widest leading-tight">{label}</span>
          {hasInfo && (
            <button
              ref={(el) => { if (el && typeof infoIndex === "number") averageInfoButtonRefs.current.set(infoIndex, el); }}
              type="button"
              className="text-gray-500 dark:text-gray-600 hover:text-gray-400 transition-colors"
              onClick={() => onInfoToggle(infoIndex)}
            >
              <Info size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {value}
          </span>
          {isProf && (
            <a
              href={getRMPUrl(value.toString())}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
              title={`View ${value} on Rate My Professor`}
            >
              <Image src="rmp.svg" alt="RMP" width={24} height={24} className="invert dark:invert-0" />
            </a>
          )}
        </div>
        {hasInfo && showInfo && (
          <div
            ref={averageInfoRef}
            className="absolute top-10 right-2 w-64 bg-gray-100 dark:bg-[#111113] border border-black/10 dark:border-white/10 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 normal-case z-30 shadow-xl"
          >
            <p>{averageGradeExplanation}</p>
            <a
              href="https://catalog.uta.edu/academicregulations/grades/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-cyan-400 hover:text-cyan-300 underline"
            >
              View UTA grading policy
            </a>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showInfoBox &&
        infoBoxRef.current &&
        !infoBoxRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowInfoBox(false);
      }
      if (openAverageInfoIndex !== null) {
        const currentButton = averageInfoButtonRefs.current.get(openAverageInfoIndex);
        const clickedOutsidePopover = averageInfoRef.current && !averageInfoRef.current.contains(event.target as Node);
        const clickedOutsideButton = !currentButton || !currentButton.contains(event.target as Node);
        if (clickedOutsidePopover && clickedOutsideButton) setOpenAverageInfoIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfoBox, openAverageInfoIndex]);

  return (
    <div className="w-full relative">
      {aggregatedData.length > 0 && aggregatedData[0] ? (
        <div className="flex flex-col p-5 rounded-xl bg-white dark:bg-[#0d0d0f] border border-black/[0.07] dark:border-white/[0.07] mb-6 gap-5 relative" style={{ boxShadow: "0 0 30px 0 rgba(14, 106, 172, 0.04)" }}>
          {/* Info Button */}
          <button
            ref={buttonRef}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-600 hover:text-gray-400 transition-colors z-20"
            title="Grade key"
            onClick={() => setShowInfoBox((prev) => !prev)}
          >
            <Info size={16} />
          </button>
          {showInfoBox && (
            <div
              ref={infoBoxRef}
              className="absolute top-10 right-4 bg-gray-100 dark:bg-[#111113] border border-black/10 dark:border-white/10 p-4 rounded-xl shadow-xl w-72 z-10"
            >
              <GradesInfoCard />
            </div>
          )}

          {/* Title */}
          <div className="text-center mt-1 pr-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">
              {aggregatedData[0]?.subject_id && aggregatedData[0]?.course_number
                ? `${aggregatedData[0].subject_id} ${aggregatedData[0].course_number}${aggregatedData[0].course_title ? ` — ${aggregatedData[0].course_title}` : ""}`
                : "Course Information"}
            </h2>
          </div>

          {aggregatedData.length === 1 ? (
            <div className="grid grid-cols-3 gap-3">
              {aggregatedData[0]?.instructor1 && (
                <StatCell label="Professor" value={aggregatedData[0].instructor1} isProf={true} />
              )}
              {aggregatedData[0]?.year && (
                <StatCell label="Section" value={`${aggregatedData[0].semester} ${aggregatedData[0].year}-${aggregatedData[0].section_number}`} />
              )}
              {aggregatedData[0]?.grades_count && (
                <StatCell label="Total Students" value={aggregatedData[0].grades_count} />
              )}
              {aggregatedData[0]?.section_number && (
                <StatCell
                  label="Pass Rate"
                  value={`${Math.ceil(((Number(aggregatedData[0].grades_A) + Number(aggregatedData[0].grades_B) + Number(aggregatedData[0].grades_C) + Number(aggregatedData[0].grades_P)) / Number(aggregatedData[0].grades_count)) * 100)}%`}
                />
              )}
              {aggregatedData[0]?.course_gpa && (
                <StatCell
                  label="Course GPA"
                  value={formatGpaValue(Number(aggregatedData[0].course_gpa))}
                  infoIndex={0}
                  showInfo={openAverageInfoIndex === 0}
                  onInfoToggle={(index) => setOpenAverageInfoIndex((prev) => prev === index ? null : index)}
                />
              )}
              {aggregatedData[0]?.grades_count && (
                <StatCell
                  label="Withdraw Rate"
                  value={`${Math.ceil(((Number(aggregatedData[0].grades_W) + Number(aggregatedData[0].grades_Q)) / Number(aggregatedData[0].grades_count)) * 100)}%`}
                />
              )}
            </div>
          ) : (
            aggregatedData.map((sectionData, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{sectionData?.instructor1}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sectionData?.instructor1 && <StatCell label="Professor" value={sectionData.instructor1} isProf={true} />}
                  {sectionData?.year && <StatCell label="Section" value={`${sectionData.semester} ${sectionData.year}-${sectionData.section_number}`} />}
                  {sectionData?.grades_count && <StatCell label="Total Students" value={sectionData.grades_count} />}
                  {sectionData?.section_number && (
                    <StatCell
                      label="Pass Rate"
                      value={`${Math.ceil(((Number(sectionData.grades_A) + Number(sectionData.grades_B) + Number(sectionData.grades_C)) / Number(sectionData.grades_count)) * 100)}%`}
                    />
                  )}
                  {sectionData?.course_gpa && (
                    <StatCell
                      label="Course GPA"
                      value={formatGpaValue(Number(sectionData.course_gpa))}
                      infoIndex={index + 1}
                      showInfo={openAverageInfoIndex === index + 1}
                      onInfoToggle={(i) => setOpenAverageInfoIndex((prev) => prev === i ? null : i)}
                    />
                  )}
                </div>
              </div>
            ))
          )}

          <BarChart grades={aggregatedData} colors={chartColors} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <div className="text-3xl">←</div>
          <p className="text-gray-900 dark:text-white text-sm font-medium">Pick a professor to get started</p>
          <p className="text-gray-500 dark:text-gray-600 text-xs">Select a name from the sidebar, then choose a year, semester, and section</p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
