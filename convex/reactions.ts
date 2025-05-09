import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }
const member=await ctx.db.query("communityMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communityId", message.communityid).eq("userId", userId.subject)
      )
      .unique();
  
      if (!member) {
        throw new Error("Unauthorized");
      };

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);
      return existingMessageReactionFromUser._id;
    } else {
      const reactionId = await ctx.db.insert("reactions", {
        memberId: member._id,
        messageId: args.messageId,
        value: args.value,
        communityid: message.communityid,
      });
      return reactionId;
    }
  },
});