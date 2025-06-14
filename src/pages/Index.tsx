import { Authenticated, Unauthenticated } from "convex/react";
import Landing from "./Landing";
import ManageEmails from "./ManageEmails";


export default function Index() {
    return (
        <div>
            <Unauthenticated>
                <Landing />
            </Unauthenticated>
            <Authenticated>
                <ManageEmails />
            </Authenticated>
        </div>
    );
}