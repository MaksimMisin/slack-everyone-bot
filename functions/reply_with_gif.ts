import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

const GIFS = [
  "https://media1.tenor.com/m/NFf-4JOw-PUAAAAC/everyone-gary-oldman.gif",
  "https://media1.tenor.com/m/NFf-4JOw-PUAAAAd/everyone-gary-oldman.gif",
  "https://media1.tenor.com/m/Q6o-SoluOS4AAAAC/gary-oldman-leon-the-professional.gif",
  "https://media1.tenor.com/m/CLWtP9Zs0MIAAAAC/everyone-leon-the-professional.gif",
  "https://media.tenor.com/CLWtP9Zs0MIAAAAM/everyone-leon-the-professional.gif",
  "https://media1.tenor.com/m/wqqtsnLt83YAAAAC/everyone-gary-oldman.gif",
  "https://media1.tenor.com/m/wqqtsnLt83YAAAAd/everyone-gary-oldman.gif",
  "https://media.tenor.com/r-X5Vw8WPtEAAAAM/leon-the-professional-norman-stansfield.gif",
];

const EVERYONE_RE = /\beveryone\b/i;

export const ReplyWithGifFunction = DefineFunction({
  callback_id: "reply_with_gif",
  title: "Reply with EVERYONE GIF",
  source_file: "functions/reply_with_gif.ts",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      message_ts: { type: Schema.types.string },
      message_text: { type: Schema.types.string },
    },
    required: ["channel_id", "message_ts", "message_text"],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  ReplyWithGifFunction,
  async ({ inputs, client }) => {
    // Double-check whole-word match (the trigger filter uses CONTAINS which is loose)
    if (!EVERYONE_RE.test(inputs.message_text)) {
      return { outputs: {} };
    }

    const gif = GIFS[Math.floor(Math.random() * GIFS.length)];

    const res = await client.chat.postMessage({
      channel: inputs.channel_id,
      thread_ts: inputs.message_ts,
      text: "Gary Oldman has something to say",
      blocks: [
        {
          type: "image",
          image_url: gif,
          alt_text: "Gary Oldman screaming EVERYONE",
        },
      ],
    });

    if (!res.ok) {
      console.error(`chat.postMessage failed: ${res.error} (gif: ${gif})`);
    }

    return { outputs: {} };
  },
);
