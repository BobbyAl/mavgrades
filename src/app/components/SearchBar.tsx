"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";

interface Suggestion {
   suggestion: string;
   type: string;
}
interface SearchBarProps {
   initialValue?: string;
   resetState?: () => void;
   course?: string;
   professor?: string;
   routeType?: "course" | "professor" | null;
}

export default function SearchBar({
   initialValue = "",
   resetState,
   course,
   professor,
   routeType,
}: SearchBarProps) {
   const [searchInput, setSearchInput] = useState(initialValue);
   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      setSearchInput(initialValue);
      // If initialValue is empty, clear suggestions.
      if (!initialValue) {
        setSuggestions([]);
      }
    }, [initialValue]);

   const fetchSuggestions = useRef(
      debounce(async (input: string) => {
          const trimmedInput = input.trim();
          if (trimmedInput.length > 1) {
              setIsLoading(true);
              try {
                  // Encode the input
                  const response = await fetch(
                      `/api/courses/search?query=${encodeURIComponent(trimmedInput)}`
                  );
                  if (!response.ok) {
                      throw new Error(`API request failed: ${response.status}`);
                  }
                  const data = await response.json();
                  setSuggestions(data);
              } catch (error) {
                  console.error("Error fetching suggestions:", error);
                  setSuggestions([]); // Clear suggestions on error
              } finally {
                  setIsLoading(false);
              }
          } else {
              setSuggestions([]);
          }
      }, 300)
    ).current;

    useEffect(() => {
      return () => {
          fetchSuggestions.cancel();
      };
    }, [fetchSuggestions]);

   const handleSearch = (suggestion: string) => {
      setSearchInput(suggestion);
      setSuggestions([]);

      /* 
         'course' contains the course subject and code e.g. "CSE 3320"
         'suggestion' contains course subject, code, and name e.g. "CSE 3320 OPERATING SYSTEMS"
         Extract the first two terms from 'suggestion' to compare against 'course' below.
      */
      const courseSuggestion = suggestion.split(" ").slice(0, 2).join(" ")

      /* 
         Do not reset the state if user searches for the content already displayed.
         e.g. If user is on the CSE 3320 page and searches for CSE 3320, do not reset
         the state as this will break the displayed results. Only reset the state if
         routing to new content. 
      */
      const isSameCourse = course && suggestion.startsWith(course) && routeType === "course";
      const isSameProfessor = professor && suggestion === professor && routeType === "professor";
  
      if (!(isSameCourse || isSameProfessor) && resetState) {
            resetState();
      }


      // Check if the suggestion is a professor or a course
      const isProfessor = suggestions.find(
         (s) => s.suggestion === suggestion && s.type === "professor"
      );

      // Splitting the input string to extract the subject_id and course_number
      const parts = courseSuggestion.split(' '); 
      if (parts.length >= 2) {
         const coursePrefix = parts[0]; 
         const courseNumber = parts[1]; 

         // Check if the second part is a four-digit number
         if (courseNumber.length === 4 && !isNaN(Number(courseNumber))) {
               suggestion = `${coursePrefix} ${courseNumber}`;
         }
      }

      if (isProfessor) {
         router.push(`/results?professor=${encodeURIComponent(suggestion)}`); // Redirect to professor results
      } else {
         router.push(`/results?course=${encodeURIComponent(suggestion)}`); // Redirect to course results
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setSearchInput(input);
      fetchSuggestions(input);
   };

   const isOpen = suggestions.length > 0 && !isLoading;

   return (
      <div className="relative w-full max-w-lg">
         <div className={`relative border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-sm transition-colors focus-within:border-black/30 dark:focus-within:border-white/30 ${isOpen ? "rounded-t-xl" : "rounded-xl"}`}>
            <input
               type="text"
               placeholder="Search for a course or professor"
               value={searchInput}
               onChange={handleInputChange}
               onKeyDown={(e) => {
                if (e.key === 'Enter' && suggestions.length > 0) {
                    handleSearch(suggestions[0].suggestion);
                    e.preventDefault();
                }
               }}
               className="w-full px-4 py-2.5 sm:py-2 bg-transparent focus:outline-none text-base sm:text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
               aria-label="Search for a course or professor"
               aria-autocomplete="list"
            />
            <FaSearch
              onClick={() => suggestions.length > 0 && handleSearch(suggestions[0].suggestion)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors w-3.5 h-3.5"
            />
         </div>
         {isLoading && (
            <div className="absolute w-full bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-t-0 border-black/10 dark:border-white/10 rounded-b-xl shadow-xl z-10 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Searching...
            </div>
         )}
         {isOpen && (
            <ul className="absolute w-full max-h-56 bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-t-0 border-black/10 dark:border-white/10 rounded-b-xl shadow-xl z-10 overflow-y-auto scrollbar-thin text-left">
               {suggestions.map((suggestion, index) => (
                  <li
                     key={index}
                     onClick={() => handleSearch(suggestion.suggestion)}
                     className="px-4 py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm transition-colors last:rounded-b-xl capitalize"
                  >
                     {suggestion.suggestion}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
