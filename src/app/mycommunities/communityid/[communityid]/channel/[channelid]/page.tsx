"use client";
import { useChannelid } from "@/hooks/use-channelid";
import { ChatInput } from "./channel-input";
import { MessagesList } from "../../../../../../../features/getMessages";
import { GetChannel } from "../../../../../../../features/getchannel";
import { AlertTriangle, Loader } from "lucide-react";
import { MessageList } from "./messagelist";

export default function Channel() {
  const channelid = useChannelid();
  const getMessages = MessagesList({ channelid });
  const getChannel = GetChannel({ channelid });

  if (getChannel.isloading || getMessages.status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }
  if (!getChannel.data) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <MessageList
          channelName={getChannel.data.title}
          channelCreationTime={getChannel.data._creationTime}
          data={getMessages.results}
          loadMore={getMessages.loadMore}
          isLoadingMore={getMessages.status === "LoadingMore"}
          canLoadMore={getMessages.status === "CanLoadMore"}
        />
      </div>

      <ChatInput />
    </div>
  );
}
