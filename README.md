# Everyone Bot (Slack Hosted)

Replies with a Gary Oldman "EVERYONE!" GIF when someone says "everyone". Runs on Slack's infrastructure — no server needed.

## Prerequisites

- [Slack CLI](https://api.slack.com/automation/cli/install) installed (`slack --version`)
- [Deno](https://deno.land) installed
- A **paid** Slack workspace (Pro, Business+, or Enterprise Grid)

## Setup

1. Authenticate the CLI:
   ```
   slack login
   ```

2. Deploy the app:
   ```
   cd slack-everyone-bot
   slack deploy
   ```

3. Create the event trigger (select the **Deployed** environment when prompted):
   ```
   slack trigger create --trigger-def triggers/everyone_trigger.ts
   ```

4. That's it. Say "hey everyone" in any channel and watch the bot reply in a thread.

## Local development

```
slack run
```

Then create a trigger for the local environment:
```
slack trigger create --trigger-def triggers/everyone_trigger.ts
```

## Logs

```
slack activity
```
