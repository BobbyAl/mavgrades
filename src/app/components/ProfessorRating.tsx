import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface ProfessorRatingProps {
  professorName: string;
}

interface RMPData {
  rmp_name: string;
  url: string;
  department: string;
  quality_rating: string;
  difficulty_rating: string;
  total_ratings: string;
  would_take_again: string;
  tags: string;
}

const ProfessorRating: React.FC<ProfessorRatingProps> = ({ professorName }) => {
  const [ratingData, setRatingData] = useState<RMPData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfessorRating = async () => {
      try {
        const response = await fetch(`/api/professor-rating?name=${encodeURIComponent(professorName)}`);
        const data = await response.json();
        setRatingData(data);
      } catch (error) {
        console.error("Error fetching professor rating:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessorRating();
  }, [professorName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-600 mr-2" />
        <span className="text-sm text-gray-500 dark:text-gray-600">Loading professor rating…</span>
      </div>
    );
  }

  if (!ratingData) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-600 mb-2" />
        <span className="text-sm text-gray-500 dark:text-gray-600">No RateMyProfessor data found for this instructor.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-gray-900 dark:text-white">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Rate My Professor</span>
          <a href={ratingData.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#0e6aac] to-cyan-400 hover:opacity-80 transition-opacity">
            View →
          </a>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{ratingData.rmp_name}</p>
        {ratingData.department && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{ratingData.department}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2">
        {[
          { label: "Quality", value: ratingData.quality_rating },
          { label: "Difficulty", value: ratingData.difficulty_rating },
          { label: "Would Take Again", value: ratingData.would_take_again },
          { label: "Total Ratings", value: ratingData.total_ratings },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-[#111113] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      {ratingData.tags && (
        <div className="flex flex-wrap gap-1.5">
          {ratingData.tags.split(", ").map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-xs text-gray-500 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorRating;
