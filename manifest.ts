import { Manifest } from "deno-slack-sdk/mod.ts";
import { EveryoneWorkflow } from "./workflows/everyone_workflow.ts";

export default Manifest({
  name: "Gary",
  description: "Replies with Gary Oldman EVERYONE GIF",
  icon: "assets/icon.png",
  workflows: [EveryoneWorkflow],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:join",
    "channels:history",
    "groups:history",
    "im:history",
    "mpim:history",
  ],
});
