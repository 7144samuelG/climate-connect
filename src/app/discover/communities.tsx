import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import { LoaderIcon } from "lucide-react";
import { CommunityCard } from "./communitycard";
import { Button } from "@/components/ui/button";

interface CommunitiesProps {
  communities: Doc<"communities">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const Communities = ({
  communities,
  loadMore,
  status
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

                <div className="grid grid-cols-3 gap-2" key={com._id}>

                  <CommunityCard key={com._id} community={com} />
                </div>
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
       <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(6)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Load more ..." : "End of Results"}
        </Button>
      </div>
    </div>
  );
};
