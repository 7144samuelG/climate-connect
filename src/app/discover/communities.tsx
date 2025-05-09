import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import { LoaderIcon } from "lucide-react";
import { CommunityCard } from "./communitycard";

interface CommunitiesProps {
  communities: Doc<"communities">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const Communities = ({
  communities
}: CommunitiesProps) => {
  return (
    <div className="max-w-screen-xl mx-auto p-16 flex flex-col gap-5">
      {communities === undefined ? (
        <div className="flex items-center justify-center h-24">
          <LoaderIcon className="animate-spin text-muted-foregound size-5" />
        </div>
      ) : (
        <div className="">
          {communities.length > 0 ? (
            <>
              {communities.map((com) => (
                <CommunityCard key={com._id} community={com} />
              ))}
            </>
          ) : (
            <div className="">
              <p className="text-center text-muted-foreground">
                No communities found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
