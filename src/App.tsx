"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + React + Clerk + Gmail
        <UserButton />
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">
          Gmail Email Manager
        </h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to access your Gmail</p>
      <SignInButton mode="modal">
        <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
          Sign in with Google
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
          Sign up with Google
        </button>
      </SignUpButton>
    </div>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Gmail Integration</h2>
          <GmailSection />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Demo Features</h2>
          <p>
            Click the button below and open this page in another window - this data
            is persisted in the Convex cloud database!
          </p>
          <p>
            <button
              className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
              onClick={() => {
                void addNumber({ value: Math.floor(Math.random() * 10) });
              }}
            >
              Add a random number
            </button>
          </p>
          <p>
            Numbers:{" "}
            {numbers?.length === 0
              ? "Click the button!"
              : numbers?.join(", ") ?? "..."}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-bold">Useful resources:</p>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <ResourceCard
              title="Convex docs"
              description="Read comprehensive documentation for all Convex features."
              href="https://docs.convex.dev/home"
            />
            <ResourceCard
              title="Gmail API docs"
              description="Learn about Gmail API integration and best practices."
              href="https://developers.google.com/gmail/api"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <ResourceCard
              title="Templates"
              description="Browse our collection of templates to get started quickly."
              href="https://www.convex.dev/templates"
            />
            <ResourceCard
              title="Discord"
              description="Join our developer community to ask questions, trade tips & tricks,
            and show off your projects."
              href="https://www.convex.dev/community"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GmailSection() {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showMessages, setShowMessages] = useState(false);

  const getLabels = useAction(api.gmail.getGmailLabels);
  const getMessages = useAction(api.gmail.getGmailMessages);
  const getUserProfile = useAction(api.gmail.getUserProfile);

  const [labels, setLabels] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGetLabels = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getLabels({});
      setLabels(result);
    } catch (err) {
      setError(`Failed to fetch labels: ${err}`);
    }
    setLoading(false);
  };

  const handleGetMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMessages({
        maxResults: 10,
        labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
      });
      setMessages(result);
      setShowMessages(true);
    } catch (err) {
      setError(`Failed to fetch messages: ${err}`);
    }
    setLoading(false);
  };

  const handleGetProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getUserProfile({});
      setProfile(result);
    } catch (err) {
      setError(`Failed to fetch profile: ${err}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md border-2 disabled:opacity-50"
          onClick={handleGetProfile}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Profile"}
        </button>
        <button
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-md border-2 disabled:opacity-50"
          onClick={handleGetLabels}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Gmail Labels"}
        </button>
        <button
          className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md border-2 disabled:opacity-50"
          onClick={handleGetMessages}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Recent Emails"}
        </button>
      </div>

      {profile && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          <h3 className="font-bold mb-2">User Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.picture && (
            <img src={profile.picture} alt="Profile" className="w-12 h-12 rounded-full mt-2" />
          )}
        </div>
      )}

      {labels.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          <h3 className="font-bold mb-2">Gmail Labels ({labels.length})</h3>
          <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
            {labels.map((label) => (
              <label key={label.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedLabels.includes(label.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLabels([...selectedLabels, label.id]);
                    } else {
                      setSelectedLabels(selectedLabels.filter(id => id !== label.id));
                    }
                  }}
                />
                {label.name}
              </label>
            ))}
          </div>
          {selectedLabels.length > 0 && (
            <div className="mt-2 text-sm">
              <strong>Selected:</strong> {selectedLabels.join(", ")}
            </div>
          )}
        </div>
      )}

      {showMessages && messages.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          <h3 className="font-bold mb-2">Recent Emails ({messages.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="border-l-4 border-blue-500 pl-3 bg-white dark:bg-slate-700 p-3 rounded">
                <div className="font-semibold text-sm">{message.subject}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">From: {message.from}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{message.date}</div>
                {message.snippet && (
                  <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">{message.snippet}</div>
                )}
                {message.labelIds && message.labelIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.labelIds.slice(0, 5).map((labelId: string) => {
                      const label = labels.find(l => l.id === labelId);
                      return label ? (
                        <span key={labelId} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                          {label.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md h-28 overflow-auto">
      <a href={href} className="text-sm underline hover:no-underline">
        {title}
      </a>
      <p className="text-xs">{description}</p>
    </div>
  );
}
