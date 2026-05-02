import React, { useEffect } from "react";

interface SelectionDropdownsProps {
   selectedProfessor: string;
   selectedCourseSubject: string | null;
   selectedYear: string | null;
   setSelectedYear: (year: string | null) => void;
   selectedSemester: string | null;
   setSelectedSemester: (semester: string | null) => void;
   finalFilteredCourses: Array<{
      subject_id: string;
      course_number: string;
      semester: string;
      year: string;
      section_number: string;
   }>;
   selectedCourse: string;
   selectedSection: {
      subject_id: string;
      course_number: string;
      semester: string;
      year: string;
      section_number: string;
   } | null;
   setSelectedSection: (
      section: {
         subject_id: string;
         course_number: string;
         semester: string;
         year: string;
         section_number: string;
      } | null
   ) => void;
   years: string[];
   semesters: string[];
}

const Pill = ({
   label,
   selected,
   onClick,
}: {
   label: string;
   selected: boolean;
   onClick: () => void;
}) => (
   <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
         selected
            ? "bg-white text-black border-white"
            : "bg-transparent text-gray-500 dark:text-gray-400 border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white"
      }`}
   >
      {label}
   </button>
);

const SelectionDropdowns: React.FC<SelectionDropdownsProps> = ({
   selectedProfessor,
   selectedCourseSubject,
   selectedYear,
   setSelectedYear,
   selectedSemester,
   setSelectedSemester,
   finalFilteredCourses,
   selectedCourse,
   selectedSection,
   setSelectedSection,
   years,
   semesters,
}) => {
   useEffect(() => {
      const courseMatches = finalFilteredCourses.filter(
         (course) =>
            `${course.subject_id} ${course.course_number}` === selectedCourse
      );

      if (courseMatches.length > 0) {
         const sortedCourses = [...courseMatches].sort(
            (a, b) =>
               parseInt(b.year) - parseInt(a.year) ||
               semesters.indexOf(b.semester) - semesters.indexOf(a.semester)
         );
         const latestCourse = sortedCourses[0];
         if (!selectedYear) setSelectedYear(latestCourse.year);
         if (!selectedSemester) setSelectedSemester(latestCourse.semester);
         if (!selectedSection) setSelectedSection(latestCourse);
      }
   }, [
      selectedProfessor,
      selectedCourse,
      finalFilteredCourses,
      semesters,
      selectedYear,
      selectedSemester,
      selectedSection,
      setSelectedYear,
      setSelectedSemester,
      setSelectedSection,
   ]);

   const [subjectId, courseNumber] = selectedCourse.split(" ");

   const sections = finalFilteredCourses.filter(
      (course) =>
         course.subject_id === subjectId &&
         course.course_number === courseNumber &&
         course.year === selectedYear &&
         course.semester === selectedSemester &&
         (selectedCourseSubject ? course.subject_id === selectedCourseSubject : true)
   );

   return (
      <div className="flex flex-col gap-3 pt-1">
         {/* Year */}
         <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1.5">Year</p>
            <div className="flex flex-wrap gap-1.5">
               {years.map((year) => (
                  <Pill
                     key={year}
                     label={year}
                     selected={selectedYear === year}
                     onClick={() => {
                        setSelectedYear(year);
                        setSelectedSemester(null);
                        setSelectedSection(null);
                     }}
                  />
               ))}
            </div>
         </div>

         {/* Semester */}
         {selectedYear && (
            <div>
               <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1.5">Semester</p>
               <div className="flex flex-wrap gap-1.5">
                  {semesters.map((sem) => (
                     <Pill
                        key={sem}
                        label={sem}
                        selected={selectedSemester === sem}
                        onClick={() => {
                           setSelectedSemester(sem);
                           setSelectedSection(null);
                        }}
                     />
                  ))}
               </div>
            </div>
         )}

         {/* Section */}
         {selectedYear && selectedSemester && sections.length > 0 && (
            <div>
               <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1.5">Section</p>
               <div className="flex flex-wrap gap-1.5">
                  {sections.map((course) => (
                     <Pill
                        key={course.section_number}
                        label={course.section_number}
                        selected={selectedSection?.section_number === course.section_number}
                        onClick={() => setSelectedSection(course)}
                     />
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default SelectionDropdowns;
