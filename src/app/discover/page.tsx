"use client";
import { useSearchParams } from "@/hooks/use-search-params";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SideBar } from "../(home)/sidebar";
import { Communities } from "./communities";
import { SearchInput } from "./search-input";

export default function DiscoverCommunities() {
   const [search]=useSearchParams();
    const { results, status, loadMore } = usePaginatedQuery(
        api.communities.getallchannels,
         {search},
         { initialNumItems: 6 }
    )
  return (
    <div className=" min-h-screen flex ">
      <SideBar/>
      <div className="mt-16 flex-1">
        <div className="">

        <SearchInput/>
        </div>
        <Communities
          communities={results}
          loadMore={loadMore}
          status={status}
        />{" "}
      </div>{" "}
    </div>
  );
}
