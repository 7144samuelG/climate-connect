import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";


export const useChannelid = () => {
  const params = useParams();

  return params.channelid as Id<"channels">;
};