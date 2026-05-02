import React from "react";

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle }) => {
  return (
    <div
      className={`lg:mt-1 relative inline-flex items-center cursor-pointer rounded-full w-11 h-5 transition-colors ${
        isEnabled ? "" : "bg-gray-600"
      }`}
      style={isEnabled ? { background: "linear-gradient(to right, #0e6aac, #22d3ee)" } : {}}
      onClick={() => onToggle(!isEnabled)}
    >
      <span
        className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ease-in-out ${
          isEnabled ? "left-6" : "left-1" 
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
