import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

const CLASSIC_GIFS = [
  "https://media1.tenor.com/m/NFf-4JOw-PUAAAAC/everyone-gary-oldman.gif",
  "https://media1.tenor.com/m/CLWtP9Zs0MIAAAAC/everyone-leon-the-professional.gif",
  "https://media1.tenor.com/m/wqqtsnLt83YAAAAC/everyone-gary-oldman.gif",
  "https://media.tenor.com/r-X5Vw8WPtEAAAAM/leon-the-professional-norman-stansfield.gif",
];

const BONUS_GIFS = [
  "https://media.tenor.com/mhsHC6S0t7kAAAAM/gif.gif",
  "https://media.tenor.com/lg_143KGGL8AAAAM/gary-oldman-actor.gif",
  "https://media.tenor.com/ESUpXpXiUuAAAAAM/never-thank-you.gif",
  "https://media.tenor.com/cmvlZ8Sy4nUAAAAM/gary-oldman-actor.gif",
  "https://media.tenor.com/CN6bNckzypoAAAAM/at-your-service.gif",
  "https://media.tenor.com/5PsOkNKH-OkAAAAM/coroca-angry.gif",
  "https://media.tenor.com/PacboAgOOoQAAAAM/gary-oldman-bingo.gif",
  "https://media.tenor.com/S2IqQC54vDYAAAAM/leon-the-professional-norman-stansfield.gif",
  "https://media.tenor.com/ntISAag9GrAAAAAM/the-professional-leon.gif",
  "https://media.tenor.com/_IzouOK5FXAAAAAC/frustrated-frustration.gif",
  "https://makeagif.com/i/9uHoPd",
];

const WEIGHTED_GIFS = [
  ...CLASSIC_GIFS.map((url) => ({ url, weight: 1 })),
  ...BONUS_GIFS.map((url) => ({ url, weight: 0.5 })),
];

const TOTAL_WEIGHT = WEIGHTED_GIFS.reduce((sum, gif) => sum + gif.weight, 0);

function pickWeightedGif(): string {
  let remaining = Math.random() * TOTAL_WEIGHT;

  for (const gif of WEIGHTED_GIFS) {
    remaining -= gif.weight;
    if (remaining <= 0) {
      return gif.url;
    }
  }

  // Fallback should never happen, but guard to satisfy TypeScript.
  return WEIGHTED_GIFS[WEIGHTED_GIFS.length - 1].url;
}

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

    const gif = pickWeightedGif();

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
