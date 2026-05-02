"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Poppins, Montserrat } from "next/font/google";
import { Sun, Moon, Github } from "lucide-react";

function ACMLogo({ className }: { className?: string }) {
  return (
    <svg width="28" height="21" viewBox="0 0 190 142" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="58.3173" y="70.7107" width="85" height="85" rx="12.5" transform="rotate(-45 58.3173 70.7107)" stroke="currentColor" strokeWidth="15"/>
      <g filter="url(#filter0_d_navbar)">
        <rect x="10.6066" y="71" width="85" height="85" rx="12.5" transform="rotate(-45 10.6066 71)" stroke="currentColor" strokeWidth="15" shapeRendering="crispEdges"/>
      </g>
      <defs>
        <filter id="filter0_d_navbar" x="4.28427" y="5.57359" width="132.853" height="132.853" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_4"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_4" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/[0.06] dark:border-white/[0.06] bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <Link href="/" className="flex items-center gap-2.5">
            <ACMLogo className="text-[#1DC7E6] dark:text-white" />
            <h1 className="text-lg tracking-wide hidden sm:block">
              <span className={`${poppins.className} font-extrabold text-gray-700 dark:text-gray-300`}>MAV</span>
              <span className={`${montserrat.className} font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0e6aac] to-cyan-400`}>GRADES</span>
            </h1>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4 sm:gap-5 text-gray-500 dark:text-gray-400">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="hover:text-black dark:hover:text-white transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link href="/faq" className="text-sm hover:text-black dark:hover:text-white transition-colors hidden sm:flex font-medium">
              FAQ
            </Link>
            <a href="https://github.com/acmuta/mavgrades" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-black dark:hover:text-white transition-colors hidden sm:flex font-medium">
              GitHub
            </a>

            <a href="https://github.com/acmuta/mavgrades" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors sm:hidden">
              <Github size={18} />
            </a>

            <a href="https://forms.gle/tAhFKDZGwN15vTUz5" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0e6aac] to-cyan-400 rounded-md hover:opacity-90 transition-opacity">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}