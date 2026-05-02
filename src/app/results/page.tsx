"use client";
import { useEffect, useState, Suspense } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import SideBar, { Course } from "../components/SideBar";
import StatsCard from "../components/StatsCard";
import ProfessorRating from "../components/ProfessorRating";
import { InteractiveGridPattern } from "../components/interactive-grid-pattern";
import { cn } from "@/lib/utils";

const ResultsContent = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");
  const professor = searchParams.get("professor");
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesToDisplay, setCoursesToDisplay] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessor, setSelectedProfessor] = useState<
    string | undefined
  >(undefined);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(
    undefined
  );
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Course | null>(null);
  const [routeType, setRouteType] = useState<"course" | "professor" | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<Map<string, any>>(
    new Map()
  );

  const fetchCourses = async () => {
    setLoading(true);
    setSelectedItems(new Map());
    try {
      if (course) {
        const response = await fetch(
          `/api/courses/search?course=${encodeURIComponent(course)}`
        );
        const data = await response.json();
        setRouteType("course");
        setSelectedCourse(course);
        setCourses(data);
      } else if (professor) {
        const response = await fetch(
          `/api/courses/search?professor=${encodeURIComponent(professor)}`
        );
        const data = await response.json();
        setSelectedProfessor(professor);
        const filteredCourses = data.filter((course: Course) => {
          const matchesProfessor = selectedProfessor
            ? course.instructor1 === selectedProfessor
            : true;
          const matchesCourse = selectedCourse
            ? course.subject_id === selectedCourse
            : true;
          return matchesProfessor && matchesCourse;
        });

        const uniqueFilteredCourses = filteredCourses.reduce(
          (acc: Course[], course: Course) => {
            const identifier = `${course.subject_id}-${course.course_number}`;
            if (
              !acc.some(
                (c: Course) =>
                  `${c.subject_id}-${c.course_number}` === identifier
              )
            ) {
              acc.push(course);
            }
            return acc;
          },
          []
        );

        setRouteType("professor");
        setCourses(filteredCourses);
        setCoursesToDisplay(uniqueFilteredCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(
    selectedProfessor,
    selectedCourse,
    selectedYear,
    selectedSemester,
    selectedSection,
    selectedItems
  );
  useEffect(() => {
    if (course || professor) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, professor]);

  const [subjectId, courseNumber] = selectedCourse
    ? selectedCourse.split(" ")
    : [null, null];
  const professors = [...new Set(courses.map((course) => course.instructor1))];
  const filteredCourses = selectedProfessor
    ? courses.filter((course) => course.instructor1 === selectedProfessor)
    : [];
  const years = [
    ...new Set(
      filteredCourses
        .filter(
          (course) =>
            !selectedCourse || // Allow all courses if no course is selected yet
            (course.subject_id === subjectId &&
              course.course_number === courseNumber)
        )
        .map((course) => course.year)
        .sort((a: any, b: any) => b - a) // Sort years in descending order
    ),
  ];
  const semesters = [
    ...new Set(
      filteredCourses
        .filter(
          (course) =>
            !selectedCourse || // Allow all courses if no course is selected yet
            (course.subject_id === subjectId &&
              course.course_number === courseNumber &&
              course.year === selectedYear)
        )
        .map((course) => course.semester)
    ),
  ];

  const finalFilteredCourses = filteredCourses
    .filter((course) => {
      const matchesYear = selectedYear ? course.year === selectedYear : true;
      const matchesSemester = selectedSemester
        ? course.semester === selectedSemester
        : true;
      return matchesYear && matchesSemester;
    })
    .sort((a, b) => {
      // Sort by section_number in ascending order
      return a.section_number.localeCompare(b.section_number);
    });

  const handleProfessorClick = (professor: any) => {
    setSelectedProfessor(professor);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  const handleCourseClick = (course: string | undefined) => {
    setSelectedCourse(course);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
  };

  const resetState = () => {
    setSelectedProfessor(undefined);
    setSelectedCourse(undefined);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setCourses([]);
    setCoursesToDisplay([]);
  };

  const isComparingMode = selectedItems.size > 1;
  const showRMP = !isComparingMode && !!selectedProfessor;
  const [mobilePanel, setMobilePanel] = useState<"filters" | "rmp" | null>(null);

  const sidebarProps = {
    professors, selectedProfessor, setSelectedProfessor: handleProfessorClick,
    years, selectedYear, selectedCourse, coursesToDisplay, setCoursesToDisplay,
    setSelectedCourse: handleCourseClick, setSelectedYear, semesters,
    selectedSemester, setSelectedSemester, finalFilteredCourses,
    selectedSection, setSelectedSection, routeType, selectedItems, setSelectedItems,
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "fixed inset-0 h-full w-full -z-10 opacity-20"
        )}
        squares={[75, 75]}
      />

      {/* Toolbar strip */}
      <div className="shrink-0 border-b border-black/[0.06] dark:border-white/[0.06] px-4 md:px-6 py-4 flex items-center gap-3">
        {/* Mobile: filter toggle */}
        <button
          className="md:hidden shrink-0 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          onClick={() => setMobilePanel(mobilePanel === "filters" ? null : "filters")}
        >
          <SlidersHorizontal size={18} />
        </button>

        {/* Desktop breadcrumb */}
        <div className="hidden md:flex w-64 shrink-0 items-center gap-2 text-sm min-w-0">
          <button onClick={resetState} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">
            Search
          </button>
          {(course || professor) && (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0e6aac] to-cyan-400 font-medium">/</span>
              <span className="text-foreground font-medium truncate">{course || professor}</span>
            </>
          )}
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center">
          <SearchBar
            initialValue={course || ""}
            resetState={resetState}
            course={selectedCourse}
            professor={selectedProfessor}
            routeType={routeType}
          />
        </div>

        {/* Desktop spacer */}
        <div className="hidden md:block w-64 shrink-0" />

        {/* Mobile: RMP toggle */}
        {showRMP && (
          <button
            className="md:hidden shrink-0 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#0e6aac] to-cyan-400"
            onClick={() => setMobilePanel(mobilePanel === "rmp" ? null : "rmp")}
          >
            RMP
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-foreground p-8">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-foreground p-8">
          No results found for &quot;{course || professor}&quot;. Please try another search.
        </p>
      ) : (
        <div className="flex flex-1 min-h-0 relative">

          {/* Mobile slide-in panel */}
          {mobilePanel && (
            <div className="md:hidden absolute inset-0 z-30 bg-background overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">
                  {mobilePanel === "filters" ? "Filters" : "Rate My Professor"}
                </span>
                <button onClick={() => setMobilePanel(null)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <X size={18} />
                </button>
              </div>
              {mobilePanel === "filters" ? (
                <SideBar {...sidebarProps} />
              ) : (
                showRMP && <ProfessorRating professorName={selectedProfessor!} />
              )}
            </div>
          )}

          {/* Left: filter panel — desktop only */}
          <aside className="hidden md:block w-64 shrink-0 overflow-y-auto border-r border-black/[0.06] dark:border-white/[0.06] p-6">
            <SideBar {...sidebarProps} />
          </aside>

          {/* Center: main stats */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <StatsCard
              selectedItems={
                selectedItems.size > 0
                  ? selectedItems
                  : new Map([["selectedSection", selectedSection]])
              }
            />
          </main>

          {/* Right: RMP panel — desktop only */}
          <aside className="hidden md:block w-64 shrink-0 overflow-y-auto border-l border-black/[0.06] dark:border-white/[0.06] p-6">
            {showRMP ? (
              <ProfessorRating professorName={selectedProfessor!} />
            ) : (
              <div className="flex items-start justify-center pt-10">
                <p className="text-xs text-gray-500 dark:text-gray-600 text-center">
                  {isComparingMode ? "RMP unavailable in compare mode" : "Select a professor to see ratings"}
                </p>
              </div>
            )}
          </aside>

        </div>
      )}
    </div>
  );
};

// Content needs to be wrapped in a Suspense tag to avoid CSR bailout due to useSearchParams()
const ResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
};

export default ResultsPage;
