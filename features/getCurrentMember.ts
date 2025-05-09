import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
interface UseCurrentMemberProps {
    communityId: Id<"communities">;
  }
  
  export const useCurrentMember = ({communityId }: UseCurrentMemberProps) => {
    const data = useQuery(api.members.current, {communityId});
    const isloading = data === undefined;
  
    return {
      data,
      isloading,
    };
  };