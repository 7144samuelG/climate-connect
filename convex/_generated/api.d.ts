/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alerts from "../alerts.js";
import type * as channels from "../channels.js";
import type * as chat from "../chat.js";
import type * as communities from "../communities.js";
import type * as gemini from "../gemini.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as note from "../note.js";
import type * as reactions from "../reactions.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  channels: typeof channels;
  chat: typeof chat;
  communities: typeof communities;
  gemini: typeof gemini;
  members: typeof members;
  messages: typeof messages;
  note: typeof note;
  reactions: typeof reactions;
  upload: typeof upload;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
