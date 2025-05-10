import { MessageSquareTextIcon, Smile, Trash } from "lucide-react";
import { EmojiPopover } from "./emoji-popover";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  hideThreadButton?: boolean;
  onThread: () => void;
  onDelete: () => void;
  onReaction: (value: string) => void;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  hideThreadButton,
  onDelete,
  onReaction,
  onThread,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => onReaction(emoji.native)}
        >
          <Button size="iconSm" variant="ghost" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={onThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={onDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};