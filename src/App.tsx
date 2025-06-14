"use client";

import { Link, Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function App() {

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-10rem)]">
        <div>
          <Outlet />
        </div>
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

