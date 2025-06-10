import { createClerkClient } from '@clerk/backend';
import { v } from "convex/values";
import { action } from "./_generated/server";



// Gmail API Integration Actions

// Get Gmail labels for the authenticated user
export const getGmailLabels = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const provider = 'google'
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    const response = await clerkClient.users.getUserOauthAccessToken(identity.subject, provider)
    console.log(response)

    try {

      const accessToken = response.data[0]?.token;

      if (!accessToken) {
        throw new Error("No OAuth access token found");
      }

      // Fetch Gmail labels
      const labelsResponse = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/labels",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!labelsResponse.ok) {
        throw new Error(`Gmail API error: ${labelsResponse.statusText}`);
      }

      const labelsData = await labelsResponse.json();
      return labelsData.labels || [];
    } catch (error) {
      console.error("Error fetching Gmail labels:", error);
      throw error;
    }

  },
});

// Get Gmail messages for the authenticated user
export const getGmailMessages = action({
  args: {
    maxResults: v.optional(v.number()),
    labelIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    try {
      // Get OAuth token from Clerk
      const tokenResponse = await fetch(
        `https://api.clerk.dev/v1/users/${identity.subject}/oauth_access_tokens/google`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get OAuth token: ${tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData[0]?.token;

      if (!accessToken) {
        throw new Error("No OAuth access token found");
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (args.maxResults) {
        params.append("maxResults", args.maxResults.toString());
      }
      if (args.labelIds && args.labelIds.length > 0) {
        params.append("labelIds", args.labelIds.join(","));
      }

      // Fetch Gmail messages list
      const messagesResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!messagesResponse.ok) {
        throw new Error(`Gmail API error: ${messagesResponse.statusText}`);
      }

      const messagesData = await messagesResponse.json();
      const messageIds = messagesData.messages || [];

      // Fetch detailed information for each message (up to 10 for demo)
      const detailedMessages = await Promise.all(
        messageIds.slice(0, 10).map(async (message: { id: string }) => {
          const messageResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (messageResponse.ok) {
            const messageData = await messageResponse.json();

            // Extract useful information
            const headers = messageData.payload?.headers || [];
            const subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";
            const from = headers.find((h: any) => h.name === "From")?.value || "Unknown Sender";
            const date = headers.find((h: any) => h.name === "Date")?.value || "";

            return {
              id: messageData.id,
              threadId: messageData.threadId,
              labelIds: messageData.labelIds,
              subject,
              from,
              date,
              snippet: messageData.snippet,
            };
          }
          return null;
        })
      );

      return detailedMessages.filter((msg: any): msg is NonNullable<typeof msg> => msg !== null);
    } catch (error) {
      console.error("Error fetching Gmail messages:", error);
      throw error;
    }
  },
});

// Get user profile information
export const getUserProfile = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    try {
      // Get OAuth token from Clerk
      const tokenResponse = await fetch(
        `https://api.clerk.dev/v1/users/${identity.subject}/oauth_access_tokens/google`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get OAuth token: ${tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData[0]?.token;

      if (!accessToken) {
        throw new Error("No OAuth access token found");
      }

      // Fetch user profile from Google
      const profileResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(`Google API error: ${profileResponse.statusText}`);
      }

      const profileData = await profileResponse.json();
      return profileData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
});

