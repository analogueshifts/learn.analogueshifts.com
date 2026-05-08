"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      // Simulate Meilisearch instant search
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockResults = [
        { id: "1", title: "Advanced React & Next.js", category: "Web Development" },
        { id: "2", title: "DevOps Masterclass", category: "DevOps" },
        { id: "3", title: "UI/UX Design for Beginners", category: "Design" },
        { id: "4", title: "Python for Data Science", category: "Data Science" },
      ].filter((c) => c.title.toLowerCase().includes(debouncedQuery.toLowerCase()));
      
      setResults(mockResults);
      setIsOpen(true);
      setIsSearching(false);
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden border border-gray-200 transition-shadow">
        <div className="grid place-items-center h-full w-14 text-gray-400">
          {isSearching ? <Loader2 className="h-5 w-5 animate-spin text-background-darkYellow" /> : <Search className="h-5 w-5" />}
        </div>
        <input
          className="peer h-full w-full outline-none text-base text-gray-700 pr-2 bg-transparent"
          type="text"
          id="search"
          placeholder="What do you want to learn today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button className="h-full px-8 bg-background-darkYellow text-white font-semibold hover:bg-yellow-600 transition-colors hidden sm:block">
          Search
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-16 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left">
          <ul className="py-2">
            {results.map((result) => (
              <li key={result.id}>
                <Link href={`/courses/${result.id}`} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-tan">{result.title}</p>
                    <p className="text-xs text-content-grayText">{result.category}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && results.length === 0 && !isSearching && debouncedQuery && (
        <div className="absolute top-16 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 p-6 text-center text-gray-500 text-sm">
          No results found for "{debouncedQuery}"
        </div>
      )}
    </div>
  );
}
