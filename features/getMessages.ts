import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { Id } from "../convex/_generated/dataModel"
interface GetMessagesProps{
    channelid:Id<"channels">;
    parentMessageId?: Id<"messages">;
    conversationId?: Id<"conversations">;
}
const BATCH_SIZE=20;
export const MessagesList=({channelid,parentMessageId,conversationId}:GetMessagesProps)=>{
    
    const { results, status, loadMore } = usePaginatedQuery(
        api.messages.getMessages,
        {
          conversationId,
          channelid,
          parentMessageId,
        },
        {
          initialNumItems: BATCH_SIZE,
        }
      );
      return{
        results,status,  loadMore: () => loadMore(BATCH_SIZE),
      }
}