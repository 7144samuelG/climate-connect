import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";


export const useCommunityId = () => {
  const params = useParams();

  return params.communityid as Id<"communities">;
};