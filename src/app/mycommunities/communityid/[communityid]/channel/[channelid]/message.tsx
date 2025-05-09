import dynamic from "next/dynamic";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "@/components/ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d ,yyyy")} at ${format(date, "h:mm:ss a")}`;
};

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"communityMembers">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"communityMembers">[];
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | null;
  createdAt: Doc<"messages">["_creationTime"];
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}
export const Message = ({
  body,
  createdAt,
  id,
  reactions,
  authorImage,
  authorName = "Member",
  hideThreadButton,
  image,
  isCompact,
  isAuthor,
}: MessageProps) => {
  const {
    parentMessageId,
    openMessage,
    close: closeMessage,
  } = usePanel();

   const deletemessage=useMutation(api.messages.deletemessage);
   const reaction=useMutation(api.reactions.toggle)
   
   const [ConfirmDialog, confirm] = useConfirm(
    "Delete message?",
    "Are you sure you want to delete this message? This cannot be undone"
  );
   const handleDelete=async()=>{
    const ok = await confirm();
    if (!ok) return;
    deletemessage({messageid:id}).then(()=>{
      if (id === parentMessageId) {
        closeMessage();
      }
      toast.success("message deleted")
    }).catch((error)=>{
      toast.error("failed to delete message")
    })
   };
   const handleReaction=(value:string)=>{
    reaction({
      messageId:id,
      value
    }).catch((error)=>{
      toast.error("failed to add reaction")
    })
   }

  if (isCompact) {
    return (
      <>
       <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            <div className="flex flex-col w-full ">

          <Renderer value={body} />
          <Thumbnail url={image} />
          <Reactions data={reactions} onChange={handleReaction} />
            </div>
          </div>

          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            hideThreadButton={hideThreadButton}
            onThread={() => {}}
            onDelete={handleDelete}
            onReaction={handleReaction}
          />
        </div>
      </>
    );
  }
  return (
    <>
     <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="rounded-md ">
              <AvatarImage className="rounded-md " src={authorImage} />
              <AvatarFallback className="rounded-md  bg-sky-500 text-white text-sm">
                {authorName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
        <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
            <button
                  className="font-bold text-primary hover:underline"
               
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt),"h:mm a")}
                  </button>
                </Hint>
            </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          <Reactions data={reactions} onChange={handleReaction} />
        </div>
        
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            hideThreadButton={hideThreadButton}
            onThread={() =>  openMessage(id)}
            onDelete={handleDelete}
            onReaction={handleReaction}
          />
        
      </div>
    </>
  );
};
