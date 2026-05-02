"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center text-xs text-gray-500 dark:text-gray-600 py-4 border-t border-black/[0.06] dark:border-white/[0.06]">
      Developed by{" "}
      <a href="https://github.com/acmuta/mavgrades" target="_blank" rel="noopener noreferrer" className="hover:underline">
        ACM @ UTA
      </a>
      . Not affiliated with or sponsored by UT Arlington.
      <br />© {year}{" "}
      <a href="https://acmuta.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        ACM @ UT Arlington
      </a>
      . All rights reserved.
    </footer>
  );
}
