import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReplyWithGifFunction } from "../functions/reply_with_gif.ts";

export const EveryoneWorkflow = DefineWorkflow({
  callback_id: "everyone_workflow",
  title: "Everyone GIF Workflow",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      message_ts: { type: Schema.types.string },
      message_text: { type: Schema.types.string },
    },
    required: ["channel_id", "message_ts", "message_text"],
  },
});

EveryoneWorkflow.addStep(ReplyWithGifFunction, {
  channel_id: EveryoneWorkflow.inputs.channel_id,
  message_ts: EveryoneWorkflow.inputs.message_ts,
  message_text: EveryoneWorkflow.inputs.message_text,
});
