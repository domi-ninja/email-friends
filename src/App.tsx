"use client";

import {
  Authenticated,
  Unauthenticated,
  useAction
} from "convex/react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { api } from "../convex/_generated/api";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import ManageEmails from "./screens/ManageEmails";

export default function App() {
  const location = useLocation();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-10rem)]">
        {location.pathname === "/" ? (
          <div>
            <Authenticated>
              <ManageEmails />
              <GmailSection />
            </Authenticated>
            <Unauthenticated>
              <div className="flex justify-center items-center flex-col gap-4">
                <Landing />
              </div>
            </Unauthenticated>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <footer className="text-sm text-muted-foreground flex flex-row gap-4 justify-center bg-accent py-8">
        <Link to="/about" className="hover:text-foreground">
          About
        </Link>
        <Link to="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
        <Link to="/tos" className="hover:text-foreground">
          Terms of Service
        </Link>
      </footer>
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
        <div className="bg-destructive/20 text-destructive-foreground p-3 rounded-md">
          {error}
        </div>
      )}

      {/* <div className="flex flex-wrap gap-2">
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
      </div> */}

      {profile && (
        <div className="bg-card text-card-foreground p-4 rounded-md">
          <h3 className="font-bold mb-2">User Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.picture && (
            <img src={profile.picture} alt="Profile" className="w-12 h-12 rounded-full mt-2" />
          )}
        </div>
      )}

      {labels.length > 0 && (
        <div className="bg-card text-card-foreground p-4 rounded-md">
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
                  className="rounded border-input"
                />
                {label.name}
              </label>
            ))}
          </div>
          {selectedLabels.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              <strong>Selected:</strong> {selectedLabels.join(", ")}
            </div>
          )}
        </div>
      )}

      {showMessages && messages.length > 0 && (
        <div className="bg-card text-card-foreground p-4 rounded-md">
          <h3 className="font-bold mb-2">Recent Emails ({messages.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="border-l-4 border-primary pl-3 bg-background p-3 rounded">
                <div className="font-semibold text-sm">{message.subject}</div>
                <div className="text-xs text-muted-foreground">From: {message.from}</div>
                <div className="text-xs text-muted-foreground">{message.date}</div>
                {message.snippet && (
                  <div className="text-sm mt-1">{message.snippet}</div>
                )}
                {message.labelIds && message.labelIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.labelIds.slice(0, 5).map((labelId: string) => {
                      const label = labels.find(l => l.id === labelId);
                      return label ? (
                        <span key={labelId} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
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

