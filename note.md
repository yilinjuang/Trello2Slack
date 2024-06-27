# Trello2Slack

This project is a Cloudflare Worker that integrates Trello with Slack. It listens for Trello webhook notifications and sends them to a Slack channel. Its main purpose is to notify the Slack user when the corresponding Trello user is mentioned in a card.

## Setup

To set up the integration, follow these steps:

1. Obtain your Trello app key by visiting [https://trello.com/app-key](https://trello.com/app-key). You will need this key to authenticate your requests to the Trello API.

2. Create a Trello webhook by visiting the [Trello REST API Webhooks documentation](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/). This will allow Trello to send notifications to your Slack workspace.

3. Get your Slack bot token by following the instructions provided in the [Slack API Authentication documentation](https://api.slack.com/authentication/token-types). This token will be used to authenticate your requests to the Slack API.

## Deployment

To deploy the Cloudflare Worker, follow these steps:

1. Install the Wrangler CLI by running the following command in your terminal:

   ```shell
   npm install -g @cloudflare/wrangler
   ```

2. Configure the `wrangler.toml` file in your project directory. This file contains the necessary configuration for deploying your Cloudflare Worker. You can find more information about configuring the `wrangler.toml` file in the [Wrangler documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration).

3. Once you have configured the `wrangler.toml` file, you can deploy your Cloudflare Worker by running the following command in your terminal:

   ```shell
   wrangler publish
   ```

   This command will build and publish your Cloudflare Worker to the specified Cloudflare account. You can find more information about the `wrangler publish` command in the [Wrangler documentation](https://developers.cloudflare.com/workers/cli-wrangler/commands#publish).
