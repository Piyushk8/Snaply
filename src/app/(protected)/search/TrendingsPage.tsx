"use client";
import { getTrendingTopics } from "@/components/TrendsSidebar";
import { formatNumber } from "@/lib/utils";
import axios from "axios";
import { Dot, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

const TrendingsPage = () => {
  const [TrendingTopics, setTrendingTopics] = useState<
    { hashtag: string; count: number }[]
  |null>(null);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const getTrendingTopicsFunction = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/search/Trending")
        setTrendingTopics(response?.data?.result);
        setLoading(false);
      } catch (error) {
        setError("Some error occured");
        setLoading(false);
      }
    };
    getTrendingTopicsFunction();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="text-primary" size={30} />
      </div>
    );
  return (
    <div className="border-border border space-y-5 mt-3 rounded-2xl bg-card p-5 shadow-sm">
      {TrendingTopics?.map(({hashtag, count },index) => {
        const title = hashtag.split("#")[1];

        return (
          <div key={index}>
            <div className="flex gap-3 items-center">
            <span className="text-slate-600 text-sm">
            {
                index+1 
            }
            </span>
            {
                <Dot size={10} className="text-slate-600"/>
            }
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
               {hashtag}
            </p>
            </div>
            <p className="text-sm ml-5 text-muted-foreground ">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TrendingsPage;
