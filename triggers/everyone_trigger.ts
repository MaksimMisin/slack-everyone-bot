import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import { EveryoneWorkflow } from "../workflows/everyone_workflow.ts";

const everyoneTrigger: Trigger<typeof EveryoneWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Everyone message trigger",
  description: "Fires when someone says everyone",
  workflow: `#/workflows/${EveryoneWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    all_resources: true,
    filter: {
      version: 1,
      root: {
        operator: "OR",
        inputs: [
          { statement: "{{data.text}} CONTAINS 'everyone'" },
          { statement: "{{data.text}} CONTAINS 'Everyone'" },
          { statement: "{{data.text}} CONTAINS 'EVERYONE'" },
          { statement: "{{data.text}} CONTAINS '<@'" },
        ],
      },
    },
  },
  inputs: {
    channel_id: { value: TriggerContextData.Event.MessagePosted.channel_id },
    message_ts: { value: TriggerContextData.Event.MessagePosted.message_ts },
    message_text: { value: TriggerContextData.Event.MessagePosted.text },
  },
};

export default everyoneTrigger;
