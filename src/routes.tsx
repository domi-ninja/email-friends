import { SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { RouteObject } from "react-router-dom";
import Privacy from "./pages/Privacy";
import Tos from "./pages/Tos";
import ManageEmails from "./screens/ManageEmails";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: (
            <>
                <Authenticated>
                    <ManageEmails />
                </Authenticated>
                <Unauthenticated>
                    <div className="flex justify-center items-center">
                        <SignIn />
                    </div>
                </Unauthenticated>
            </>
        ),
    },
    {
        path: "/privacy",
        element: <Privacy />,
    },
    {
        path: "/tos",
        element: <Tos />,
    },
]; 