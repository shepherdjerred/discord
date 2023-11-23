import _ from "lodash";
import { z } from "zod";

// the chat for one player
// the key is the reviewer, the value is the parent message id
export type PlayerChats = z.infer<typeof PlayerChatsSchema>;
export const PlayerChatsSchema = z.record(z.string(), z.string());

// the chats for all players
// the key is the player, the value is a map of reviewer to parent message id
export type Chats = z.infer<typeof ChatsSchema>;
export const ChatsSchema = z.record(z.string(), PlayerChatsSchema);
