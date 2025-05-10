"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { HashIcon } from "lucide-react";
import { Screenloader } from "@/components/screen-loader";
import { useCommunityId } from "@/hooks/use-communityid";
import { Members } from "./members";

export const GetChannels = () => {
  const communityid = useCommunityId();
  const channels = useQuery(api.channels.get, { communityid });
  const isloading = channels === undefined;
  if (isloading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Screenloader label="loading" />
      </div>
    );
  }
  if (!isloading && channels.length < 1) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="">no channel found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-2">
      {channels.map((chan) => (
        <div className="flex items-center space-x-1 px-3" key={chan._id}>
          <HashIcon className="size-4" />
          <p className="cursor-pointer truncate">{chan.title}</p>
        </div>
      ))}
      <Members/>
    </div>
  );
};
