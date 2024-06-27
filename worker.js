// Cloudflare Worker script entry point
addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

// Define a mapping of Trello usernames to Slack user IDs
const members = {
  "@TRELLO_USERNAME_1": "SLACK_USER_ID_1",
  "@TRELLO_USERNAME_2": "SLACK_USER_ID_2",
  "@TRELLO_USERNAME_3": "SLACK_USER_ID_3",
};

/**
 * Handles incoming requests and returns a response.
 *
 * @param {Request} request - The incoming request.
 * @returns {Promise<Response>} - The response to be sent back.
 */
async function handleRequest(request) {
  if (request.method === "POST") {
    const payload = await request.json();
    const actionType = payload?.action?.type;

    // Check if the action type is related to commenting on a card
    if (actionType === "commentCard" || actionType === "updateComment") {
      const data = payload.action.data;
      const cardName = data?.card?.name;
      const cardShortLink = data?.card?.shortLink;
      const text = data?.text || data?.action?.text || "";

      // Check if the comment includes a mention to the entire board
      if (text.includes("@board")) {
        const commentAuthor = payload.action.memberCreator;
        const authorUsername = commentAuthor.username;

        // Iterate over the members and send notifications to those who are not the comment author
        for (const id in members) {
          if (id === `@${authorUsername}`) {
            // Avoid sending notification to the author themselves
            continue;
          }

          if (members[id]) {
            await slack(
              toSlackMessage(
                members[id],
                cardName,
                text,
                `https://trello.com/c/${cardShortLink}`
              )
            );
          }
        }
      } else {
        // Iterate over the members and send notifications to those who are mentioned in the comment
        for (const id in members) {
          if (text.includes(id)) {
            if (members[id]) {
              await slack(
                toSlackMessage(
                  members[id],
                  cardName,
                  text,
                  `https://trello.com/c/${cardShortLink}`
                )
              );
            }
          }
        }
      }
    }
  }

  return new Response("ok");
}

/**
 * Converts the notification details into a Slack message format.
 *
 * @param {string} userId - The Slack user ID to send the message to.
 * @param {string} title - The title of the Trello card.
 * @param {string} body - The body of the Trello card comment.
 * @param {string} link - The link to the Trello card.
 * @returns {object} - The Slack message object.
 */
function toSlackMessage(userId, title, body, link) {
  return {
    channel: userId,
    text: `[Trello] ${title}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: body,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Open Card",
            },
            url: link,
            action_id: "open_card",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: ":trello: Trello Notification",
          },
        ],
      },
    ],
  };
}

/**
 * Sends a Slack message.
 *
 * @param {object} message - The Slack message object.
 * @returns {Promise<Response>} - The response from the Slack API.
 * @link https://api.slack.com/methods/chat.postMessage
 */
async function slack(message) {
  const token = "{SLACK_BOT_TOKEN}";
  const body = JSON.stringify(message);
  return fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
}
