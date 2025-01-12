import TrendsSidebar from "@/components/TrendsSidebar";
import SearchResultsPage from "./searchResults";

interface PageProps{
    searchParams:{q:string},

}

export default function Page({searchParams:{q}}:PageProps) {
    return (
    <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
            <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h1 className="text-center text-2xl font-bold break-all line-clamp-1
                ">
                    Search results for &quot;{q}&quot; 
                </h1>
            </div>
            <SearchResultsPage query={q}/>
        </div>
        <TrendsSidebar/>
    </main>
    )
}