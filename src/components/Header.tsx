import { UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 bg-background border-b flex flex-row justify-between items-center p-4">
            <div className="flex flex-row items-center gap-4">
                <Link to="/" className="flex flex-row items-center gap-2 text-foreground hover:text-foreground/80">
                    <img src="/favicon.ico" alt="Email Friends" className="w-8 h-8" />
                    Email Friends
                </Link>
            </div>
            <Authenticated>
                <UserButton />
            </Authenticated>
            <Unauthenticated>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hover:underline px-4 py-2 rounded-md border-2 border-foreground">
                    Login
                </Link>
            </Unauthenticated>
        </header>
    )
}
