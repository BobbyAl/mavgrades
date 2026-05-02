import { useState } from "react";

interface FAQDropdownProps {
   question: string;
   answer: string;
}

const FAQDropdown: React.FC<FAQDropdownProps> = ({ question, answer }) => {
   const [isOpen, setIsOpen] = useState(false);

   const toggleDropdown = () => {
      setIsOpen((prev) => !prev);
   };

   return (
      <div className="border-gray-200">
         <button
            className={`flex justify-between items-center w-full py-4 text-left text-gray-900 dark:text-white focus:outline-none bg-gray-200 dark:bg-gray-200 ${
               isOpen ? "bg-opacity-40" : "bg-opacity-20"
            } rounded-t-lg hover:bg-opacity-40 transition-all duration-200 ${
               isOpen ? "" : "rounded-b-lg"
            }`}
            onClick={toggleDropdown}
         >
            <span className="ml-5 mr-5 text-lg font-medium">{question}</span>
            <span
               className={`mr-5 transition-transform ${
                  isOpen ? "rotate-180" : ""
               }`}
            >
               ▼
            </span>
         </button>
         {isOpen && (
            <div className="py-2 text-gray-900 dark:text-white bg-gray-200 bg-opacity-20 rounded-b-lg">
               <div
                  className="ml-5 mr-5"
                  dangerouslySetInnerHTML={{ __html: answer }}
               />
            </div>
         )}
      </div>
   );
};

export default FAQDropdown;
