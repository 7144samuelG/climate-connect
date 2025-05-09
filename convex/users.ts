import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server";

export const storeuser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

      if (user !== null) {
        // If we've seen this identity before but the name has changed, patch the value.
        if (user.name !== identity.name) {
          await ctx.db.patch(user._id, { name: identity.name });
        }
        return user._id;
      }
      return await ctx.db.insert("users", {
        name: identity.name ?? "Anonymous",
        tokenIdentifier: identity.tokenIdentifier,
        email:identity.email?? "",
        avatar:identity.pictureUrl?? ""
      });
  },
});
