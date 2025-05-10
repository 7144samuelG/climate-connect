import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export const byEnumChat = v.union(v.literal("user"), v.literal("bot"));
export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),
  communities: defineTable({
    name: v.string(),
    description: v.string(),
    creatorid: v.string(),
    isPublic: v.boolean(),
    membersCount: v.number(),
    imageUrl: v.optional(v.string()),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["name", "description"],
  }),
  channels: defineTable({
    communityId: v.id("communities"),
    title: v.string(),
    isGeneral: v.boolean(), // Flag for general channel
    createdBy: v.string(),
  }).index("by_community", ["communityId"]),
  communityMembers: defineTable({
    communityId: v.id("communities"),
    userId: v.string(),
    avatar: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("member"),
      v.literal("moderator"),
      v.literal("admin")
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_community", ["communityId"])
    .index("by_community_user", ["communityId", "userId"]),
  conversations: defineTable({
    communityId: v.id("communities"),
    memberOneId: v.id("communityMembers"),
    memberTwoId: v.id("communityMembers"),
  }).index("by_community_id", ["communityId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("communityMembers"),
    communityid: v.id("communities"),
    channelId: v.id("channels"),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  })
    .index("by_community_id", ["communityid"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  reactions: defineTable({
    communityid: v.id("communities"),
    messageId: v.id("messages"),
    memberId: v.id("communityMembers"),
    value: v.string(),
  })
    .index("by_community_id", ["communityid"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
  alerts: defineTable({
    id:v.string(),
    city: v.string(),
    country: v.string(),
    phonenumber: v.string(),
  })
    .index("by_country", ["country"])
    .index("by_phone", ["phonenumber"]),
  note: defineTable({
    title: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
  chats: defineTable({
    noteId: v.id("note"),
    data: v.string(),
    userId: v.string(),
    by: byEnumChat,
  })
    .index("by_note", ["noteId"])
    .index("by_user", ["userId"]),
});
