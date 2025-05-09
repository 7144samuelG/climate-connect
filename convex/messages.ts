import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessage = messages.at(-1)!;
  const lastMessageMember = await populateMember(ctx, lastMessage?.memberId);

  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }


  return {
    count: messages.length,
    image: lastMessageMember.avatar,
    timeStamp: lastMessage._creationTime,
    name: lastMessageMember?.name,
  };
};

  
const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"communityMembers">) => {
  return ctx.db.get(memberId);
};
const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const getMember = async (
  ctx: QueryCtx,
  communityId: Id<"communities">,
  userId: string
) => {
  return ctx.db
    .query("communityMembers")
    .withIndex("by_community_user", (q) =>
      q.eq("communityId", communityId).eq("userId", userId)
    )
    .unique();
};
export const create = mutation({
    args: {
      body: v.string(),
      image: v.optional(v.id("_storage")),
      communityId: v.id("communities"),
      channelId:v.id("channels"),
      conversationId: v.optional(v.id("conversations")),
      parentMessageId: v.optional(v.id("messages")),
    },
    handler: async (ctx, args) => {
      const userId = await ctx.auth.getUserIdentity();
  
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const member = await ctx.db
      .query("communityMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communityId", args.communityId).eq("userId", userId.subject)
      )
      .unique();
  
      if (!member) {
        throw new Error("Unauthorized");
      }

      let _conversationId = args.conversationId;

     
      if (!args.conversationId && !args.channelId &&args.parentMessageId) {
        const parentMessage = await ctx.db.get(args.parentMessageId);
  
        if (!parentMessage) {
          throw new Error("Parent message not found");
        }
  
        _conversationId = parentMessage.conversationId;
      }
  
      const messageId = await ctx.db.insert("messages", {
        memberId: member._id,
        body: args.body,
        image: args.image,
        channelId: args.channelId,
        communityid: args.communityId,
        parentMessageId: args.parentMessageId,
      });
  
      return messageId;
    },
  });

  export const getMessages=query({
    args:{
      channelid:v.id("channels"),
      conversationId: v.optional(v.id("conversations")),
      parentMessageId: v.optional(v.id("messages")),
      paginationOpts: paginationOptsValidator,
    },
    handler:async(ctx,args)=>{
      const userId = await ctx.auth.getUserIdentity()

    if (!userId) {
      throw new ConvexError("Unauthorized");
    };
    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelid && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    };
    const result = await ctx.db
    .query("messages")
    .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
      q
        .eq("channelId", args.channelid)
        .eq("parentMessageId", args.parentMessageId)
        .eq("conversationId", _conversationId)
    )
    .order("desc")
    .paginate(args.paginationOpts);
    return{
      ...result,
      page: (
        await Promise.all(
          result.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            if (!member) {
              return null;
            };
            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"communityMembers">[];
              })[]
            );

            const reactionsWithoutMemberId = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              reactions: reactionsWithoutMemberId,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timeStamp,
              threadName: thread.name,
            };
          })
        )
      ).filter((message) => message !== null),
          }
        } 
  })
  export const deletemessage=mutation({
    args:{
      messageid:v.id("messages")
    },
    handler:async(ctx,args)=>{
      const user=await ctx.auth.getUserIdentity();
      if(!user){
        throw new ConvexError("unauthorized");
      };
      const getMessage=await ctx.db.get(args.messageid);
      if(!getMessage){
        throw new ConvexError("message not found");
      };

      const member=await ctx.db.query("communityMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communityId", getMessage.communityid).eq("userId", user.subject)
      )
      .unique();
  
      if (!member) {
        throw new Error("Unauthorized");
      };

      if(member._id!==getMessage.memberId){
        throw new ConvexError("only owner")
      };

      await ctx.db.delete(args.messageid);
      return args.messageid;

    }
  })
  export const getById = query({
    args: {
      id: v.id("messages"),
    },
    handler: async (ctx, args) => {
      const userId = await ctx.auth.getUserIdentity();
  
      if (!userId) {
        return null;
      }
  
      const message = await ctx.db.get(args.id);
  
      if (!message) return null;
  
      const currentMember = await getMember(ctx, message.communityid, userId.subject);
  
      if (!currentMember) {
        return null;
      }
  
      const member = await populateMember(ctx, message.memberId);
  
      if (!member) return null;
  
  
  
      const reactions = await populateReactions(ctx, args.id);
  
      const reactionsWithCounts = reactions.map((reaction) => {
        return {
          ...reaction,
          count: reactions.filter((r) => r.value === reaction.value).length,
        };
      });
  
      const dedupedReactions = reactionsWithCounts.reduce(
        (acc, reaction) => {
          const existingReaction = acc.find((r) => r.value === reaction.value);
  
          if (existingReaction) {
            existingReaction.memberIds = Array.from(
              new Set([...existingReaction.memberIds, reaction.memberId])
            );
          } else {
            acc.push({ ...reaction, memberIds: [reaction.memberId] });
          }
          return acc;
        },
        [] as (Doc<"reactions"> & {
          count: number;
          memberIds: Id<"communityMembers">[];
        })[]
      );
  
      const reactionsWithoutMemberId = dedupedReactions.map(
        ({ memberId, ...rest }) => rest
      );
  
      return {
        ...message,
        image: message.image
          ? await ctx.storage.getUrl(message.image)
          : undefined,
        member,
        reactions: reactionsWithoutMemberId,
      };
    },
  });