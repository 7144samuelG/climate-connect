import { MdOutlineAddReaction } from "react-icons/md";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { useCommunityId } from "@/hooks/use-communityid";
import { useCurrentMember } from "../../../../../../../features/getCurrentMember";
import { Hint } from "@/components/ui/hint";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";



interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"communityMembers">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const communityId = useCommunityId();
  const currentMember = useCurrentMember({ communityId});

  if (data.length === 0 || !currentMember.data?._id) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              currentMember.data &&
                reaction.memberIds.includes(currentMember.data?._id) &&
                "bg-blue-100/70 border-blue-500 text-blue-500"
            )}
            onClick={() => onChange(reaction.value)}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs text-muted-foreground font-semibold",
                currentMember.data &&
                  reaction.memberIds.includes(currentMember.data?._id) &&
                  "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent text-slate-800 hover:border-slate-500 flex items-center gap-x-1">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  );
};