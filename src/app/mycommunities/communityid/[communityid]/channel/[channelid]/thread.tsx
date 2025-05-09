"use client"
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../../../../../../../features/getMessage";
import { Message } from "./message";
import { useCommunityId } from "@/hooks/use-communityid";
import { useCurrentMember } from "../../../../../../../features/getCurrentMember";
import { useRef, useState } from "react";
import Quill from "quill";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useChannelid } from "@/hooks/use-channelid";
import { toast } from "sonner";
import { MessagesList } from "../../../../../../../features/getMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date,"EEEE,MMMM d")
  };

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
type CreateMessageValues = {
  channelId: Id<"channels">;
  communityid: Id<"communities">;
  parentMessageId:Id<"messages">
  body: string;
  image?: Id<"_storage">;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
    const {data:message,isloading}= useGetMessage({ id: messageId });
    const uploadurl = useMutation(api.upload.generateUploadUrl);
     const sendmessage=useMutation(api.messages.create)
     const [editorKey, setEditorKey] = useState(0);
     const [isPending, setIsPending] = useState(false);
     const communityId=useCommunityId();
     const channelId=useChannelid();
     const { results,status,  loadMore}=MessagesList({
        channelid:channelId,
        parentMessageId:messageId
     })
      const currentMember = useCurrentMember({
        communityId,
      });
      const editorRef = useRef<Quill | null>(null);
      const canLoadMore=status==="CanLoadMore";
      const isLoadingMore=status==="LoadingMore";
       const groupedMessages = results?.reduce(
          (groups, mes) => {
            const date = new Date(mes._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");
            if (!groups[dateKey]) {
              groups[dateKey] = [];
            }
            groups[dateKey].unshift(mes);
            return groups;
          },
          {} as Record<string, typeof results>
        );

    if (isloading||status==="LoadingFirstPage") {
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
              <p className="text-lg font-bold">Thread</p>
              <Button onClick={onClose} size="iconSm" variant="ghost">
                <XIcon className="size-5 stroke-[1.5] " />
              </Button>
            </div>
            <div className="flex h-full items-center justify-center">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        );
      }
      if(!message){
        return (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5] " />
                </Button>
              </div>
              <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                <AlertTriangle className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Message not found</p>
              </div>
            </div>
          );
      }
    const handleSubmit=async ({
         body,
         image,
       }: {
         body: string;
         image: File | null;
       }) => {
         try{
           setIsPending(true);
           editorRef.current?.enable(false);
     
           const values: CreateMessageValues = {
             channelId,
             communityid:communityId,
             parentMessageId:messageId,
             body,
             image: undefined,
           };
           if (image!==null) {
             const url = await uploadurl()
     
             const result = await fetch(url, {
               method: "POST",
               headers: { "Content-Type": image.type },
               body: image,
             });
     
             if (!result.ok) {
               throw new Error("Failed to upload image");
             }
     
             const { storageId } = await result.json();
     
             values.image = storageId;
           }
            sendmessage({
             body:values.body,
             communityId:values.communityid,
             channelId:values.channelId,
             image:values.image,
             parentMessageId:values.parentMessageId
            })
            setEditorKey((prev) => prev + 1);
   
         }catch(error){
           toast.error("Failed to send message");
         }finally{
           setIsPending(false);
           editorRef.current?.enable(true);
         }
       }
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5] " />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
         <div key={dateKey}>
         <div className="text-center my-2 relative">
           <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
           <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
             {formatDateLabel(dateKey)}
           </span>
         </div>
          {messages.map((mes, index) => {
         
                     const prevMessage = messages[index - 1];
                     const isCompact = prevMessage && prevMessage.member?._id === mes.member?._id && differenceInMinutes(
                       new Date(mes._creationTime),
                       new Date(prevMessage._creationTime)
                       ) < TIME_THRESHOLD;
                     return(
                        <Message
                        key={mes._id}
                        id={mes._id}
                        memberId={mes.memberId}
                        authorImage={mes.member.avatar}
                        authorName={mes.member.name}
                        reactions={mes.reactions}
                        body={mes.body}
                        image={message.image}
                        createdAt={mes._creationTime}
                        threadCount={mes.threadCount}
                        threadImage={mes.threadImage}
                        threadTimestamp={mes.threadTimestamp}
                        threadName={mes.threadName}
                        isCompact={isCompact}
                        hideThreadButton
                        isAuthor={currentMember.data?._id===message.memberId}
                      />
                     )
                    })}
         </div>
      ))}
      <div
              className="h-1"
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting && canLoadMore) {
                        loadMore();
                      }
                    },
                    {
                      threshold: 1.0,
                    }
                  );
                  observer.observe(el);
                  return () => observer.disconnect();
                }
              }}
            />
             {isLoadingMore && (
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                  <Loader className="size-4 animate-spin" />
                </span>
              </div>
            )}
    
      </div>
      <div className="px-4">
        <Editor
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder="Reply..."
          key={editorKey}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};
