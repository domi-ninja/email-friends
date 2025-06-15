"use client";

import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-sm text-muted-foreground flex flex-row gap-4 justify-center bg-zinc-200 py-8">
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
      <Toaster
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
          },
        }}
        theme="system"
        position="top-right"
        expand={true}
        richColors={true}
        closeButton={false}
      />
    </div>
  );
}

