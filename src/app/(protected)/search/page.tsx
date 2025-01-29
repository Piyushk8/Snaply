"use client";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import SearchResultsPage from "./searchResults";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeopleQueryPage from "./PeopleResultsPage";
import TrendingsPage from "./TrendingsPage";

export default function Page() {
  const queryParam = useSearchParams();
  const [query, setQuery] = useState(queryParam.get("q") || "");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(queryParam.get("q") || "");
    }, 500);

    return () => clearTimeout(timeout);
  }, [queryParam]);

  return (
    <main className="flex flex-col h-[calc(100dvh-10rem)] w-full min-w-0">
      {/* Fixed header section */}
      <div className="flex-none p-4 bg-card">
        <div className="flex justify-center">
          <Input
            onChange={(e) => setQuery(e.target.value)}
            className="bg-input md:w-1/2 border-border border"
            placeholder="Search..."
            defaultValue={query}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-grow overflow-hidden">
        <Tabs defaultValue="Top" className="h-full flex flex-col">
          <TabsList className="w-full border-border border">
            <TabsTrigger value="Top">Top</TabsTrigger>
            <TabsTrigger value="People">People</TabsTrigger>
            <TabsTrigger value="Trending">Trending</TabsTrigger>
          </TabsList>

          {/* Ensuring TabsContent takes full height */}
          <div className="flex-grow overflow-hidden">
            <TabsContent value="Top" className="h-full">
              <div className="h-full overflow-auto scrollbar-thin">
                <SearchResultsPage query={query} />
              </div>
            </TabsContent>
            <TabsContent value="People" className="h-full w-full">
              <PeopleQueryPage query={query} />
            </TabsContent>
            <TabsContent value="Trending" className="h-full overflow-auto">
              <TrendingsPage />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
