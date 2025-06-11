import { createClerkClient } from '@clerk/backend';
import { v } from "convex/values";
import { action } from "./_generated/server";

// Helper function to get OAuth token consistently
const getGoogleAccessToken = async (userId: string) => {
  console.log(`[getGoogleAccessToken] Starting token retrieval for user: ${userId}`);

  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    console.log(`[getGoogleAccessToken] Requesting OAuth token from Clerk...`);
    const response = await clerkClient.users.getUserOauthAccessToken(userId, 'google');

    console.log(`[getGoogleAccessToken] Clerk response received:`, {
      dataLength: response.data?.length || 0,
      hasData: !!response.data,
      firstTokenExists: !!response.data?.[0],
    });

    const accessToken = response.data[0]?.token;

    if (!accessToken) {
      console.error(`[getGoogleAccessToken] No access token found in response:`, response.data);
      throw new Error("No OAuth access token found. Make sure Google OAuth is properly configured with Gmail scopes.");
    }

    // Log token info (first and last 4 characters for security)
    const tokenInfo = {
      tokenLength: accessToken.length,
      tokenPreview: `${accessToken.substring(0, 4)}...${accessToken.substring(accessToken.length - 4)}`,
      expiresAt: response.data[0]?.expiresAt,
      scopes: response.data[0]?.scopes,
    };
    console.log(`[getGoogleAccessToken] Token retrieved successfully:`, tokenInfo);

    return accessToken;
  } catch (error) {
    console.error("[getGoogleAccessToken] Failed to get Google OAuth token:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    throw new Error("Failed to authenticate with Google. Please reconnect your account.");
  }
};

// Helper function to make authenticated Gmail API requests
const gmailApiRequest = async (accessToken: string, endpoint: string, params?: Record<string, string>) => {
  const url = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  console.log(`[gmailApiRequest] Making request to: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[gmailApiRequest] API request failed:`, {
      status: response.status,
      statusText: response.statusText,
      errorText,
      url: url.toString(),
    });

    if (response.status === 403) {
      throw new Error("Gmail access forbidden. Please ensure your OAuth app has the Gmail API enabled and the correct scopes (https://www.googleapis.com/auth/gmail.readonly).");
    }

    throw new Error(`Gmail API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Type definitions for Gmail API responses
interface GmailLabel {
  id?: string;
  name?: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
  type?: string;
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
  color?: {
    textColor?: string;
    backgroundColor?: string;
  };
}

interface GmailMessageListResponse {
  messages?: Array<{
    id?: string;
    threadId?: string;
  }>;
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

interface GmailMessageHeader {
  name?: string;
  value?: string;
}

interface GmailMessageResponse {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: GmailMessageHeader[];
  };
  internalDate?: string;
}

// Type for processed message
interface ProcessedMessage {
  id: string | null | undefined;
  threadId: string | null | undefined;
  labelIds: string[] | null | undefined;
  subject: string;
  from: string;
  date: string;
  snippet: string | null | undefined;
}

// Gmail API Integration Actions

// Get Gmail labels for the authenticated user
export const getGmailLabels = action({
  args: {},
  handler: async (ctx) => {
    console.log(`[getGmailLabels] Starting labels retrieval...`);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error(`[getGmailLabels] No user identity found`);
      throw new Error("User not authenticated");
    }

    console.log(`[getGmailLabels] User identity:`, {
      subject: identity.subject,
      email: identity.email,
      emailVerified: identity.emailVerified,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
    });

    try {
      const accessToken = await getGoogleAccessToken(identity.subject);

      console.log(`[getGmailLabels] Making Gmail API request...`);
      const response = await gmailApiRequest(accessToken, 'labels') as { labels?: GmailLabel[] };

      console.log(`[getGmailLabels] Gmail API response:`, {
        labelsCount: response.labels?.length || 0,
        hasLabels: !!response.labels,
      });

      return response.labels || [];
    } catch (error: any) {
      console.error("[getGmailLabels] Error fetching Gmail labels:", {
        message: error.message,
        stack: error.stack,
      });

      throw new Error(`Failed to fetch Gmail labels: ${error.message}`);
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
    console.log(`[getGmailMessages] Starting messages retrieval with args:`, args);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error(`[getGmailMessages] No user identity found`);
      throw new Error("User not authenticated");
    }

    console.log(`[getGmailMessages] User identity: ${identity.subject} (${identity.email})`);

    try {
      const accessToken = await getGoogleAccessToken(identity.subject);

      console.log(`[getGmailMessages] Making Gmail messages list API request...`);

      // Prepare query parameters
      const params: Record<string, string> = {
        maxResults: (args.maxResults || 10).toString(),
      };

      if (args.labelIds && args.labelIds.length > 0) {
        // Gmail API expects labelIds as separate parameters
        args.labelIds.forEach(labelId => {
          params.labelIds = labelId;
        });
      }

      // Get message list
      const listResponse = await gmailApiRequest(accessToken, 'messages', params) as GmailMessageListResponse;

      console.log(`[getGmailMessages] Messages list response:`, {
        messagesCount: listResponse.messages?.length || 0,
        nextPageToken: listResponse.nextPageToken,
        resultSizeEstimate: listResponse.resultSizeEstimate,
      });

      const messageIds = listResponse.messages || [];

      console.log(`[getGmailMessages] Fetching detailed info for ${Math.min(messageIds.length, 10)} messages...`);

      // Fetch detailed information for messages
      const detailedMessages = await Promise.all(
        messageIds.slice(0, 10).map(async (message, index: number) => {
          try {
            console.log(`[getGmailMessages] Fetching message ${index + 1}/${Math.min(messageIds.length, 10)}: ${message.id}`);

            const messageResponse = await gmailApiRequest(accessToken, `messages/${message.id}`) as GmailMessageResponse;

            const headers = messageResponse.payload?.headers || [];

            const getHeader = (name: string) =>
              headers.find((h: GmailMessageHeader) => h.name === name)?.value || "";

            const result = {
              id: messageResponse.id,
              threadId: messageResponse.threadId,
              labelIds: messageResponse.labelIds,
              subject: getHeader("Subject") || "No Subject",
              from: getHeader("From") || "Unknown Sender",
              date: getHeader("Date"),
              snippet: messageResponse.snippet,
            } as ProcessedMessage;

            console.log(`[getGmailMessages] Successfully processed message ${message.id}: "${result.subject}" from ${result.from}`);
            return result;
          } catch (error) {
            console.error(`[getGmailMessages] Failed to fetch message ${message.id}:`, {
              error: error instanceof Error ? error.message : error,
              messageIndex: index,
            });
            return null;
          }
        })
      );

      const validMessages = detailedMessages.filter((msg): msg is ProcessedMessage => msg !== null);
      console.log(`[getGmailMessages] Successfully processed ${validMessages.length} out of ${messageIds.length} messages`);

      return validMessages;
    } catch (error: any) {
      console.error("[getGmailMessages] Error fetching Gmail messages:", {
        message: error.message,
        stack: error.stack,
      });

      throw new Error(`Failed to fetch Gmail messages: ${error.message}`);
    }
  },
});

// Get user profile information
export const getUserProfile = action({
  args: {},
  handler: async (ctx) => {
    console.log(`[getUserProfile] Starting profile retrieval...`);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error(`[getUserProfile] No user identity found`);
      throw new Error("User not authenticated");
    }

    console.log(`[getUserProfile] User identity: ${identity.subject} (${identity.email})`);

    try {
      const accessToken = await getGoogleAccessToken(identity.subject);

      console.log(`[getUserProfile] Making Google userinfo API request...`);

      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[getUserProfile] API request failed:`, {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });

        if (response.status === 403) {
          throw new Error("Google profile access forbidden. Please check your OAuth scopes.");
        }

        throw new Error(`Google userinfo API request failed: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();

      console.log(`[getUserProfile] Profile response:`, {
        hasData: !!userData,
        email: userData.email,
        verifiedEmail: userData.verified_email,
        name: userData.name,
      });

      return userData;
    } catch (error: any) {
      console.error("[getUserProfile] Error fetching user profile:", {
        message: error.message,
        stack: error.stack,
      });

      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  },
});


