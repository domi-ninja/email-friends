import { EmailFiltered } from "../../convex/emailManaged";
import EmailDisplay from "./EmailDisplay";

interface EmailsAcceptOrDenyProps {
    emails: EmailFiltered[];
}

export default function EmailsAcceptOrDeny({ emails }: EmailsAcceptOrDenyProps) {
    return (
        <>
            {emails?.map((email: EmailFiltered) => (
                <div key={email.emailManagedId} className="py-2">
                    <div className="flex gap-2 justify-end items-end">
                        <button className="text-on-destructive bg-destructive px-4 py-2 rounded-md">
                            Mute
                        </button>
                        <button className="text-on-primary bg-primary px-4 py-2 rounded-md">
                            Add friend
                        </button>
                    </div>
                    <EmailDisplay email={email} />
                </div>
            ))}
        </>
    );
}