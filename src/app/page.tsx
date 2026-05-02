import Head from "next/head";
import { Poppins, Montserrat } from "next/font/google";
import SearchBar from "./components/SearchBar";
import { InteractiveGridPattern } from "./components/interactive-grid-pattern";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const popularSearches = ["CSE 3310", "MATH 1426", "Barry Spurlock", "PHYS 1443"];

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden">
      <Head>
        <title>MavGrades</title>
      </Head>

      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full -z-10 opacity-30"
        )}
        squares={[75, 75]}
      />

      <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-center px-4 -mt-16">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-sm text-[10px] sm:text-xs text-gray-500 dark:text-white/50 text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300 inline-block" />
          Now updated with Spring 2025 data
        </div>

        {/* Wordmark */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide leading-none">
          <span className={`${poppins.className} font-extrabold text-gray-800 dark:text-gray-200`}>MAV</span>
          <span className={`${montserrat.className} font-light text-transparent bg-clip-text bg-gradient-to-r from-[#0e6aac] to-cyan-400`}>GRADES</span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-md leading-relaxed px-2">
          Official UTA grade distributions for every course and professor — before you enroll.
        </p>

        {/* Search */}
        <div className="w-full mt-2 flex flex-col items-center">
          <SearchBar />
          <p className="mt-3 text-xs sm:text-sm text-gray-600 px-4 leading-relaxed">
            Try: {popularSearches.join(" · ")}
          </p>
        </div>

      </div>
    </div>
  );
}
