import React, { useState, useEffect } from "react";
import SelectionDropdowns from "./SelectionDropdowns";
import ToggleSwitch from "./ToggleSwitch";

export interface Course {
   subject_id: string;
   course_number: string;
   instructor1: string;
   section_number: string;
   semester: string;
   year: string;
   course_gpa: string;
   grades_count: number;
   grades_A: number;
   grades_B: number;
   grades_C: number;
   grades_D: number;
   grades_F: number;
   grades_I: number;
   grades_P: number;
   grades_Q: number;
   grades_W: number;
   grades_Z: number;
   grades_R: number;
}

interface SideBarProps {
   professors: string[];
   selectedProfessor: string | undefined;
   setSelectedProfessor: (professor: string | undefined) => void;
   years: string[];
   selectedYear: string | null;
   setSelectedYear: (year: string | null) => void;
   selectedCourse: string | undefined;
   setSelectedCourse: (course: string | undefined) => void;
   coursesToDisplay: any[];
   setCoursesToDisplay: (course: Course[]) => void;
   semesters: string[];
   selectedSemester: string | null;
   setSelectedSemester: (semester: string | null) => void;
   finalFilteredCourses: any[];
   selectedSection: any | null;
   setSelectedSection: (section: any | null) => void;
   routeType: "course" | "professor" | null;
   selectedItems: Map<string, any>;
   setSelectedItems: React.Dispatch<React.SetStateAction<Map<string, any>>>;
}

const SideBar: React.FC<SideBarProps> = ({
   professors,
   selectedProfessor,
   setSelectedProfessor,
   years,
   selectedYear,
   selectedCourse,
   coursesToDisplay,
   setCoursesToDisplay: _setCoursesToDisplay,
   setSelectedCourse,
   setSelectedYear,
   semesters,
   selectedSemester,
   setSelectedSemester,
   finalFilteredCourses,
   selectedSection,
   setSelectedSection,
   routeType,
   selectedItems,
   setSelectedItems,
}) => {
   const [openProfessorAccordion, setOpenProfessorAccordion] = useState<number | null>(null);
   const [openCourseAccordion, setOpenCourseAccordion] = useState<number | null>(null);
   const [checkboxEnabled, setCheckboxEnabled] = useState(false);
   const [checkboxState, setCheckboxState] = useState<Map<string, boolean>>(new Map());
   const [isSelectionComplete, setIsSelectionComplete] = useState<Map<string, boolean>>(new Map());

   const handleToggleChange = (enabled: boolean) => {
      setCheckboxEnabled(enabled);
      setSelectedItems(new Map());
      setCheckboxState(new Map());
   };

   const onToggle = (isEnabled: any) => {
      setCheckboxEnabled(isEnabled);
      handleToggleChange(isEnabled);
   };

   const handleCheckboxChange = (isChecked: boolean, key: string) => {
      if (isChecked) {
         if (selectedItems.size >= 3) {
            alert("You can only select up to 3 for comparison.");
            return;
         }
         const selectionsComplete = isSelectionComplete.get(key);

         if (selectionsComplete) {
            setSelectedItems((prevMap) => new Map(prevMap).set(key, selectedSection));
         } else {
            setSelectedItems((prevMap) => new Map(prevMap).set(key, null));
         }
      } else {
         setSelectedItems((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(key);
            return newMap;
         });
      }

      setCheckboxState((prevMap) => new Map(prevMap).set(key, isChecked));
   };

   useEffect(() => {
      if (selectedProfessor) {
         const allSelectionsMade = selectedYear && selectedSemester && selectedSection;

         setIsSelectionComplete((prevMap) =>
            new Map(prevMap).set(selectedProfessor, allSelectionsMade)
         );

         if (checkboxState.get(selectedProfessor) && allSelectionsMade) {
            setSelectedItems((prevMap) =>
               new Map(prevMap).set(selectedProfessor, selectedSection)
            );
         }
      }

      if (selectedCourse) {
         const allSelectionsMade = selectedYear && selectedSemester && selectedSection;

         setIsSelectionComplete((prevMap) =>
            new Map(prevMap).set(selectedCourse, allSelectionsMade)
         );

         if (checkboxState.get(selectedCourse) && allSelectionsMade) {
            setSelectedItems((prevMap) =>
               new Map(prevMap).set(selectedCourse, selectedSection)
            );
         }
      }
   }, [
      selectedYear,
      selectedSemester,
      selectedSection,
      selectedProfessor,
      selectedCourse,
      checkboxState,
   ]);

   

   const toggleProfessorAccordion = (index: number, professor: string) => {
      setOpenProfessorAccordion(openProfessorAccordion === index ? null : index);
      setSelectedProfessor(professor);
   };

   const toggleCourseAccordion = (index: number, course: string) => {
      setOpenCourseAccordion(openCourseAccordion === index ? null : index);
      setSelectedCourse(course);
   };



   return (
      <div className="flex flex-col w-full h-full overflow-hidden">
         {routeType === "course" ? (
            <div className="z-10 sticky top-0 pb-4">
               <div className="align-middle flex mb-4">
                  <span className="mr-5 text-gray-900 dark:text-white text-sm">Compare professors</span>
                  <ToggleSwitch isEnabled={checkboxEnabled} onToggle={onToggle} />
               </div>
            </div>
         ) : null}
      
         <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {routeType === "course" ? (
               <ul className="space-y-2">
                  {professors.slice().sort((a, b) => a.localeCompare(b)).map((professor, index) => (
                     <li
                        key={index}
                        className="p-4 rounded-lg shadow-sm cursor-pointer bg-white dark:bg-[#0d0d0f] border border-black/[0.07] dark:border-white/[0.07]"
                        onClick={() => toggleProfessorAccordion(index, professor)}
                     >
                        <div className="flex items-center">
                           {checkboxEnabled && (
                              <input
                                 type="checkbox"
                                 className="mr-2"
                                 disabled={!checkboxEnabled}
                                 checked={checkboxState.get(professor) || false}
                                 onChange={(e) => {
                                    handleCheckboxChange(e.target.checked, professor);
                                    toggleProfessorAccordion(index, professor);
                                 }}
                              />
                           )}
                           <div className="flex justify-between items-center flex-1 cursor-pointer">
                              <div>
                                 <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{professor}</h2>
                                 {openProfessorAccordion !== index && selectedProfessor === professor && selectedSection && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                       {selectedSection.semester} {selectedSection.year} · {selectedSection.section_number}
                                    </p>
                                 )}
                              </div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                 {openProfessorAccordion === index ? "−" : "+"}
                              </span>
                           </div>
                        </div>
      
                        {openProfessorAccordion === index && (
                           <div
                              className="mt-3 cursor-auto"
                              onClick={(event) => event.stopPropagation()}
                           >
                              <SelectionDropdowns
                                 selectedProfessor={professor}
                                 selectedCourseSubject={null}
                                 selectedYear={selectedYear}
                                 setSelectedYear={setSelectedYear}
                                 selectedSemester={selectedSemester}
                                 setSelectedSemester={setSelectedSemester}
                                 finalFilteredCourses={finalFilteredCourses}
                                 selectedCourse={selectedCourse || ""}
                                 selectedSection={selectedSection}
                                 setSelectedSection={setSelectedSection}
                                 years={years}
                                 semesters={semesters}
                              />
                           </div>
                        )}
                     </li>
                  ))}
               </ul>
            ) : routeType === "professor" ? (
               <ul className="space-y-4">
                  {coursesToDisplay.map((course, index) => (
                     <li
                        key={index}
                        className="p-4 rounded-lg shadow-sm cursor-pointer bg-white dark:bg-[#0d0d0f] border border-black/[0.07] dark:border-white/[0.07]"
                        onClick={() => toggleCourseAccordion(index, `${course.subject_id} ${course.course_number}`)}
                     >
                        <div className="flex items-center">
                           <div className="flex justify-between items-center flex-1">
                              <div>
                                 <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {`${course.subject_id} ${course.course_number}`}
                                 </h2>
                                 {openCourseAccordion !== index && selectedSection && selectedCourse === `${course.subject_id} ${course.course_number}` && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                       {selectedSection.semester} {selectedSection.year} · {selectedSection.section_number}
                                    </p>
                                 )}
                              </div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                 {openCourseAccordion === index ? "−" : "+"}
                              </span>
                           </div>
                        </div>
      
                        {openCourseAccordion === index && (
                           <div
                              className="mt-3 cursor-auto"
                              onClick={(event) => event.stopPropagation()}
                           >
                              <SelectionDropdowns
                                 selectedProfessor={course.instructor1}
                                 selectedCourseSubject={course.subject_id}
                                 selectedYear={selectedYear}
                                 setSelectedYear={setSelectedYear}
                                 selectedSemester={selectedSemester}
                                 setSelectedSemester={setSelectedSemester}
                                 finalFilteredCourses={finalFilteredCourses}
                                 selectedCourse={selectedCourse || ""}
                                 selectedSection={selectedSection}
                                 setSelectedSection={setSelectedSection}
                                 years={years}
                                 semesters={semesters}
                              />
                           </div>
                        )}
                     </li>
                  ))}
               </ul>
            ) : null}
         </div>
      </div>
   );
};

export default SideBar;
