"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Loader, SearchIcon } from "lucide-react";
import SearchResultsDropDown from "./ui/searchResultDropDown";

const SearchField = () => {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();

    if (!q) return;
    setSearching(true);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget as Node)
    ) {
      setSearchValue("");
    }
  };

  return (
    <div className="relative w-full" onBlur={handleBlur}>
      <form onSubmit={handleSubmit} method="GET" action="/search" className="w-full">
        <div className="relative w-full">
          <Input
            onChange={(e) => setSearchValue(e.target.value.trim())}
            name="q"
            placeholder="Search.."
            className="w-full"
          />
          {searching ? (
            <Loader className="animate-spin absolute top-2 right-3 text-muted-foreground" />
          ) : (
            <SearchIcon className="absolute top-2 right-3 text-muted-foreground size-5" />
          )}
        </div>
      </form>
      {searchValue && (
        <div
          ref={dropdownRef}
          className="w-full mt-0.5 max-h-[calc(100vh-20rem)] mb-3"
        >
          <SearchResultsDropDown query={searchValue} />
        </div>
      )}
    </div>
  );
};

export default SearchField;
